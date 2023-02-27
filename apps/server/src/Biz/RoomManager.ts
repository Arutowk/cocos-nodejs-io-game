import Singleton from "../Base/Singleton";
import { ApiMsgEnum, IApiPlayerJoinReq } from "../Common";
import { Connection } from "../Core";
import { Player } from "./Player";
import { PlayerManager } from "./PlayerManager";
import { Room } from "./Room";

export class RoomManager extends Singleton {
  static get Instance() {
    return super.GetInstance<RoomManager>();
  }

  nextRoomId: number = 1;

  rooms: Set<Room> = new Set();
  idMapRoom: Map<number, Room> = new Map();

  createRoom() {
    const room = new Room(this.nextRoomId++);
    this.rooms.add(room);
    this.idMapRoom.set(room.id, room);
    return room;
  }

  joinRoom(rid: number, uid: number) {
    const room = this.idMapRoom.get(rid);
    if (room) {
      room.join(uid);
      return room;
    }
  }

  //   removePlayer(pid: number) {
  //     const player = this.idMapPlayer.get(pid);
  //     if (player) {
  //       this.players.delete(player);
  //       this.idMapPlayer.delete(player.id);
  //     }
  //   }

  //   syncPlayers() {
  //     for (const player of this.players) {
  //       player.connection.sendMsg(ApiMsgEnum.MsgPlayerList, {
  //         list: this.getPlayersView(),
  //       });
  //     }
  //   }

  getRoomsView(rooms: Set<Room> = this.rooms) {
    return [...rooms].map((p) => this.getRoomView(p));
  }

  getRoomView({ id, players }: Room) {
    return { id, players: PlayerManager.Instance.getPlayersView(players) };
  }
}
