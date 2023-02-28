import { _decorator, resources, Asset } from "cc";
import Singleton from "../Base/Singleton";
import { IModel } from "../Common";

interface IItem {
  cb: Function;
  ctx: unknown;
}

interface ICallApiRet<T> {
  success: boolean;
  res?: T;
  error?: Error;
}

export class NetworkManager extends Singleton {
  static get Instance() {
    return super.GetInstance<NetworkManager>();
  }

  port = 9876;
  ws: WebSocket;
  private map: Map<string, Array<IItem>> = new Map();
  isConnected = false;

  connect() {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve(true);
        return;
      }
      this.ws = new WebSocket(`ws://localhost:${this.port}`);
      this.ws.onopen = () => {
        this.isConnected = true;
        resolve(true);
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        reject(false);
      };

      this.ws.onerror = (e) => {
        console.log(e);
        reject(false);
      };

      this.ws.onmessage = (e) => {
        try {
          console.log("onmessage", e.data);
          const json = JSON.parse(e.data);
          const { name, data } = json;
          if (this.map.has(name)) {
            this.map.get(name).forEach(({ cb, ctx }) => {
              cb.call(ctx, data);
            });
          }
        } catch (error) {
          console.log(error);
        }
      };
    });
  }

  callApi<T extends keyof IModel["api"]>(
    name: T,
    data: IModel["api"][T]["req"]
  ): Promise<ICallApiRet<IModel["api"][T]["res"]>> {
    //发布订阅模式改造为异步函数形式
    return new Promise((resolve) => {
      try {
        const timer = setTimeout(() => {
          resolve({ success: false, error: new Error("Time out!") });
          this.unlistenMsg(name as any, cb, null);
        }, 5000);
        const cb = (res) => {
          resolve(res);
          clearTimeout(timer);
          this.unlistenMsg(name as any, cb, null);
        };
        this.listenMsg(name as any, cb, null);
        this.sendMsg(name as any, data);
      } catch (error) {
        resolve({ success: false, error });
      }
    });
  }

  async sendMsg<T extends keyof IModel["msg"]>(
    name: T,
    data: IModel["msg"][T]
  ) {
    const msg = { name, data };
    // await new Promise((rs) => setTimeout(rs, 2000));
    this.ws.send(JSON.stringify(msg));
  }

  listenMsg<T extends keyof IModel["msg"]>(
    name: T,
    cb: (args: IModel["msg"][T]) => void,
    ctx: unknown
  ) {
    if (this.map.has(name)) {
      this.map.get(name).push({ cb, ctx });
    } else {
      this.map.set(name, [{ cb, ctx }]);
    }
  }

  unlistenMsg<T extends keyof IModel["msg"]>(
    name: T,
    cb: (args: IModel["msg"][T]) => void,
    ctx: unknown
  ) {
    if (this.map.has(name)) {
      const index = this.map
        .get(name)
        .findIndex((i) => cb === i.cb && i.ctx === ctx);
      index > -1 && this.map.get(name).splice(index, 1);
    }
  }
}
