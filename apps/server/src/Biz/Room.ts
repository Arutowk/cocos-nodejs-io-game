import { ApiMsgEnum } from "../Common";
import { Connection } from "../Core";
import { Player } from "./Player";
import { PlayerManager } from "./PlayerManager";
import { RoomManager } from "./RoomManager";

export class Room {
  id: number;
  players: Set<Player> = new Set();

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
}
