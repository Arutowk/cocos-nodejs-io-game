import {
  ApiMsgEnum,
  EntityTypeEnum,
  IClientInput,
  IMsgClientSync,
  IState,
} from "../Common";
import { Connection } from "../Core";
import { Player } from "./Player";
import { PlayerManager } from "./PlayerManager";
import { RoomManager } from "./RoomManager";

export class Room {
  id: number;
  players: Set<Player> = new Set();

  pendingInput: IClientInput[] = [];

  constructor(rid: number) {
    this.id = rid;
  }

  join(uid: number) {
    const player = PlayerManager.Instance.idMapPlayer.get(uid);
    if (player) {
      player.rid = this.id;
      this.players.add(player);
    }
  }

  leave(uid: number) {
    const player = PlayerManager.Instance.idMapPlayer.get(uid);
    if (player) {
      player.rid = undefined;
      this.players.delete(player);
      if (!this.players.size) {
        RoomManager.Instance.closeRoom(this.id);
      }
    }
  }

  close() {
    this.players.clear();
  }

  sync() {
    for (const player of this.players) {
      player.connection.sendMsg(ApiMsgEnum.MsgRoom, {
        room: RoomManager.Instance.getRoomView(this),
      });
    }
  }

  start() {
    const state: IState = {
      actors: [...this.players].map((player, index) => ({
        id: player.id,
        nickname: player.nickname,
        hp: 100,
        type: EntityTypeEnum.Actor1,
        weaponType: EntityTypeEnum.Weapon1,
        bulletType: EntityTypeEnum.Bullet2,
        position: { x: -150 + index * 300, y: -150 + index * 300 },
        direction: { x: 1, y: 0 },
      })),
      bullets: [],
      nextBulletId: 1,
    };

    for (const player of this.players) {
      player.connection.sendMsg(ApiMsgEnum.MsgGameStart, {
        state,
      });
      player.connection.listenMsg(
        ApiMsgEnum.MsgClientSync,
        this.getClientMsg,
        this
      );
    }

    const timer1 = setInterval(() => {
      this.sendServerMsg();
    }, 100);
  }

  getClientMsg(connection, { input, frameId }: IMsgClientSync) {
    this.pendingInput.push(input);
  }

  sendServerMsg() {
    const inputs = this.pendingInput;
    this.pendingInput = [];
    for (const player of this.players) {
      player.connection.sendMsg(ApiMsgEnum.MsgServerSync, {
        lastFrameId: 0,
        inputs,
      });
    }
  }
}
