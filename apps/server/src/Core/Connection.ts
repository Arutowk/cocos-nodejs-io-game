import { EventEmitter } from "stream";
import { WebSocket } from "ws";
import {
  ApiMsgEnum,
  binaryDecode,
  binaryEncode,
  IModel,
  strdecode,
  strencode,
} from "../Common";
import { buffer2ArrayBuffer } from "../Utils";
import { MyServer } from "./MyServer";

interface IItem {
  cb: Function;
  ctx: unknown;
}

//继承内置模块EventEmitter
export class Connection extends EventEmitter {
  private msgMap: Map<ApiMsgEnum, Array<IItem>> = new Map();

  constructor(private server: MyServer, private ws: WebSocket) {
    super();
    this.ws.on("close", () => {
      this.emit("close");
    });
    this.ws.on("message", (buffer: Buffer) => {
      try {
        const json = binaryDecode(buffer2ArrayBuffer(buffer));
        const { name, data } = json;
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
                cb.call(ctx, this, data);
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

  sendMsg<T extends keyof IModel["msg"]>(name: T, data: IModel["msg"][T]) {
    const msg = { name, data };

    const da = binaryEncode(name, data);
    const buffer = Buffer.from(da.buffer);

    this.ws.send(buffer);
  }

  listenMsg<T extends keyof IModel["msg"]>(
    name: T,
    cb: (connection: Connection, args: IModel["msg"][T]) => void,
    ctx: unknown
  ) {
    if (this.msgMap.has(name)) {
      this.msgMap.get(name).push({ cb, ctx });
    } else {
      this.msgMap.set(name, [{ cb, ctx }]);
    }
  }

  unlistenMsg<T extends keyof IModel["msg"]>(
    name: T,
    cb: (connection: Connection, args: IModel["msg"][T]) => void,
    ctx: unknown
  ) {
    if (this.msgMap.has(name)) {
      const index = this.msgMap
        .get(name)
        .findIndex((i) => cb === i.cb && i.ctx === ctx);
      index > -1 && this.msgMap.get(name).splice(index, 1);
    }
  }
}
