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

  leaveRoom(rid: number, uid: number) {
    const room = this.idMapRoom.get(rid);
    if (room) {
      room.leave(uid);
    }
  }

  closeRoom(rid: number) {
    const room = this.idMapRoom.get(rid);
    if (room) {
      room.close();
      this.rooms.delete(room);
      this.idMapRoom.delete(room.id);
    }
  }

  startRoom(rid: number) {
    const room = this.idMapRoom.get(rid);
    if (room) {
      room.start();
    }
  }

  syncRooms() {
    for (const player of PlayerManager.Instance.players) {
      player.connection.sendMsg(ApiMsgEnum.MsgRoomList, {
        list: this.getRoomsView(),
      });
    }
  }

  syncRoom(rid: number) {
    const room = this.idMapRoom.get(rid);
    if (room) {
      room.sync();
    }
  }

  getRoomsView(rooms: Set<Room> = this.rooms) {
    return [...rooms].map((p) => this.getRoomView(p));
  }

  getRoomView({ id, players }: Room) {
    return { id, players: PlayerManager.Instance.getPlayersView(players) };
  }
}
