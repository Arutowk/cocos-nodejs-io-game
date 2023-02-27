import { symlinkCommon } from "./Utils";
import { WebSocketServer } from "ws";
import {
  ApiMsgEnum,
  IApiPlayerJoinReq,
  IApiPlayerJoinRes,
  IApiPlayerListReq,
  IApiPlayerListRes,
  IApiRoomCreateReq,
  IApiRoomCreateRes,
} from "./Common";
import { Connection, MyServer } from "./Core";
import { PlayerManager } from "./Biz/PlayerManager";
import { RoomManager } from "./Biz/RoomManager";

symlinkCommon();

declare module "./Core" {
  interface Connection {
    playerId: number;
  }
}

const server = new MyServer({ port: 9876 });

server.on("connection", () => {
  console.log("来人了", server.connections.size);
});

server.on("disconnection", (connection: Connection) => {
  console.log("走人了", server.connections.size);
  if (connection.playerId) {
    PlayerManager.Instance.removePlayer(connection.playerId);
  }
  //玩家离开时同步
  PlayerManager.Instance.syncPlayers();
  console.log("size", PlayerManager.Instance.players.size);
});

server.setApi(
  ApiMsgEnum.ApiPlayerJoin,
  (connection: Connection, data: IApiPlayerJoinReq): IApiPlayerJoinRes => {
    const { nickname } = data;
    const player = PlayerManager.Instance.createPlayer({
      nickname,
      connection,
    });
    connection.playerId = player.id;
    //有新玩家的时候就同步
    PlayerManager.Instance.syncPlayers();
    return { player: PlayerManager.Instance.getPlayerView(player) };
  }
);

server.setApi(
  ApiMsgEnum.ApiPlayerList,
  (connection: Connection, data: IApiPlayerListReq): IApiPlayerListRes => {
    return { list: PlayerManager.Instance.getPlayersView() };
  }
);

server.setApi(
  ApiMsgEnum.ApiRoomCreate,
  (connection: Connection, data: IApiRoomCreateReq): IApiRoomCreateRes => {
    if (connection.playerId) {
      const newRoom = RoomManager.Instance.createRoom();
      const room = RoomManager.Instance.joinRoom(
        newRoom.id,
        connection.playerId
      );
      if (room) {
        return { room: RoomManager.Instance.getRoomView(room) };
      } else {
        throw new Error("房间不存在");
      }
    } else {
      throw new Error("未登录");
    }
  }
);

server
  .start()
  .then(() => {
    console.log("我的服务启动");
  })
  .catch((e) => {
    console.log(e);
  });

// const wss = new WebSocketServer({ port: 9876 });

// let inputs = [];

// wss.on("connection", (socket) => {
//   socket.on("message", (buffer) => {
//     const str = buffer.toString();
//     try {
//       const msg = JSON.parse(str);
//       const { name, data } = msg;
//       const { frameId, input } = data;
//       inputs.push(input);
//     } catch (error) {
//       console.log(error);
//     }
//   });
//   //每当有客户端连接时，启用定时器定时给客户端发送input
//   setInterval(() => {
//     const temp = inputs;
//     inputs = [];
//     const msg = { name: ApiMsgEnum.MsgServerSync, data: { inputs: temp } };
//     socket.send(JSON.stringify(msg));
//   }, 100);

//   //   const obj = { name: "haha", data: "123" };
//   //   socket.send(JSON.stringify(obj));
// });

// wss.on("listening", () => {
//   console.log("服务启动!");
// });
