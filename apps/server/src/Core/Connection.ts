import { EventEmitter } from "stream";
import { WebSocket } from "ws";
import { MyServer } from "./MyServer";

interface IItem {
  cb: Function;
  ctx: unknown;
}

//继承内置模块EventEmitter
export class Connection extends EventEmitter {
  private msgMap: Map<string, Array<IItem>> = new Map();

  constructor(private server: MyServer, private ws: WebSocket) {
    super();
    this.ws.on("close", () => {
      this.emit("close");
    });
    this.ws.on("message", (buffer: Buffer) => {
      const str = buffer.toString();
      try {
        const msg = JSON.parse(str);
        const { name, data } = msg;
        if (this.server.apiMap.has(name)) {
          try {
            const cb = this.server.apiMap.get(name);
            const res = cb.call(null, this, data);
            this.sendMsg(name, { success: true, res });
          } catch (e) {
            this.sendMsg(name, { success: false, error: e.message });
          }
        } else {
          try {
            if (this.msgMap.has(name)) {
              this.msgMap.get(name).forEach(({ cb, ctx }) => {
                cb.call(ctx, data);
              });
            }
          } catch (e) {
            console.log(e);
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  sendMsg(name: string, data: any) {
    const msg = { name, data };
    this.ws.send(JSON.stringify(msg));
  }

  listenMsg(name: string, cb: Function, ctx: unknown) {
    if (this.msgMap.has(name)) {
      this.msgMap.get(name).push({ cb, ctx });
    } else {
      this.msgMap.set(name, [{ cb, ctx }]);
    }
  }

  unlistenMsg(name: string, cb: Function, ctx: unknown) {
    if (this.msgMap.has(name)) {
      const index = this.msgMap
        .get(name)
        .findIndex((i) => cb === i.cb && i.ctx === ctx);
      index > -1 && this.msgMap.get(name).splice(index, 1);
    }
  }
}
