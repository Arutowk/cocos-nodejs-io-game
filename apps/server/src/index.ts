import { symlinkCommon } from "./Utils";
import { WebSocketServer } from "ws";
import { json } from "stream/consumers";

symlinkCommon();

const wss = new WebSocketServer({ port: 9876 });

wss.on("connection", (socket) => {
  socket.on("message", (buffer) => {
    console.log(buffer.toString());
  });
  const obj = { name: "haha", data: "123" };
  socket.send(JSON.stringify(obj));
});

wss.on("listening", () => {
  console.log("服务启动!");
});
