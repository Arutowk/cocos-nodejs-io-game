import { EventEmitter } from "stream";
import { WebSocket, WebSocketServer } from "ws";
import { ApiMsgEnum } from "../Common";
import { Connection } from "./Connection";

export class MyServer extends EventEmitter {
  port: number;
  wss: WebSocketServer;
  connections: Set<Connection> = new Set();
  apiMap: Map<ApiMsgEnum, Function> = new Map();

  constructor({ port }: { port: number }) {
    super();
    this.port = port;
  }

  start() {
    return new Promise((resolve, reject) => {
      this.wss = new WebSocketServer({ port: 9876 });
      this.wss.on("listening", () => {
        resolve(true);
      });
      this.wss.on("close", () => {
        reject(false);
      });
      this.wss.on("error", (e) => {
        reject(e);
      });
      this.wss.on("connection", (ws: WebSocket) => {
        const connection = new Connection(this, ws);
        this.connections.add(connection);
        this.emit("connection", connection);

        connection.on("close", () => {
          this.connections.delete(connection);
          this.emit("disconnection", connection);
        });
      });
    });
  }

  setApi(name: ApiMsgEnum, cb: Function) {
    this.apiMap.set(name, cb);
  }
}
