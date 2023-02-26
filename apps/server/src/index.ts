import { symlinkCommon } from "./Utils";
import { WebSocketServer } from "ws";
import { ApiMsgEnum } from "./Common";
import { MyServer } from "./Core";

symlinkCommon();

const server = new MyServer({ port: 9876 });

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
