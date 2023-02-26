import {
  _decorator,
  Component,
  Node,
  Prefab,
  instantiate,
  SpriteFrame,
} from "cc";
import {
  ApiMsgEnum,
  EntityTypeEnum,
  IClientInput,
  InputTypeEnum,
} from "../Common";
import { ActorManager } from "../Entity/Actor/ActorManager";
import { BulletManager } from "../Entity/Bullet/BulletManager";
import { EventEnum, PrefabPathEnum, TexturePathEnum } from "../Enum";
import DataManager from "../Global/DataManager";
import EventManager from "../Global/EventManager";
import { NetworkManager } from "../Global/NetworkManager";
import { ObjectPoolManager } from "../Global/ObjectPoolManager";
import { ResourceManager } from "../Global/ResourceManager";
import { JoyStickManager } from "../UI/JoyStickManager";
const { ccclass, property } = _decorator;

@ccclass("BattleManager")
export class BattleManager extends Component {
  private stage: Node;
  private ui: Node;
  private shouldUpdate = false;

  onLoad() {}

  async start() {
    this.clearGame();
    await Promise.all([this.connectSever(), this.loadRes()]);
    const { success, error, res } = await NetworkManager.Instance.callApi(
      ApiMsgEnum.ApiPlayerJoin,
      "我是cocos"
    );
    if (!success) {
      console.log(error);
      return;
    }
    console.log("res!", res);
    this.initGame();
  }

  initGame() {
    DataManager.Instance.jm = this.ui.getComponentInChildren(JoyStickManager);
    this.initMap();
    this.shouldUpdate = true;
    EventManager.Instance.on(EventEnum.ClientSync, this.handleClientSync, this);
    NetworkManager.Instance.listenMsg(
      ApiMsgEnum.MsgServerSync,
      this.handleServerSync,
      this
    );
  }

  clearGame() {
    EventManager.Instance.off(
      EventEnum.ClientSync,
      this.handleClientSync,
      this
    );
    NetworkManager.Instance.unlistenMsg(
      ApiMsgEnum.MsgServerSync,
      this.handleServerSync,
      this
    );
    this.stage = this.node.getChildByName("Stage");
    DataManager.Instance.stage = this.stage;
    this.ui = this.node.getChildByName("UI");
    this.stage.destroyAllChildren();
  }

  async connectSever() {
    if (!(await NetworkManager.Instance.connect().catch(() => false))) {
      await new Promise((res) => setTimeout(res, 1000));
      await this.connectSever();
    }
  }

  async loadRes() {
    const list = [];
    //枚举编译为js其实就是对象
    //预加载prefab
    for (const type in PrefabPathEnum) {
      const p = ResourceManager.Instance.loadRes(
        PrefabPathEnum[type],
        Prefab
      ).then((prefab) => {
        DataManager.Instance.prefabMap.set(type, prefab);
      });
      list.push(p);
    }
    //预加载texture
    for (const type in TexturePathEnum) {
      const p = ResourceManager.Instance.loadDir(
        TexturePathEnum[type],
        SpriteFrame
      ).then((spriteFrames) => {
        DataManager.Instance.textureMap.set(type, spriteFrames);
      });
      list.push(p);
    }
    await Promise.all(list);
  }

  initMap() {
    const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Map);
    const map = instantiate(prefab);
    map.setParent(this.stage);
  }

  update(dt) {
    if (!this.shouldUpdate) return;
    this.render();
    //管理Actor
    this.tick(dt);
  }

  render() {
    this.renderActor();
    this.renderBullet();
  }

  tick(dt) {
    this.tickActor(dt);
    DataManager.Instance.applyInput({
      type: InputTypeEnum.TimePast,
      dt,
    });
  }

  tickActor(dt) {
    for (const data of DataManager.Instance.state.actors) {
      const { id } = data;
      let am = DataManager.Instance.actorMap.get(id);
      am.tick(dt);
    }
  }

  async renderActor() {
    for (const data of DataManager.Instance.state.actors) {
      const { id, type } = data;
      let am = DataManager.Instance.actorMap.get(id);
      if (!am) {
        const prefab = DataManager.Instance.prefabMap.get(type);
        const actor = instantiate(prefab);
        actor.setParent(this.stage);
        am = actor.addComponent(ActorManager);
        DataManager.Instance.actorMap.set(id, am);
        am.init(data);
      } else {
        am.render(data);
      }
    }
  }

  async renderBullet() {
    for (const data of DataManager.Instance.state.bullets) {
      const { id, type } = data;
      let bm = DataManager.Instance.bulletMap.get(id);
      if (!bm) {
        const bullet = ObjectPoolManager.Instance.get(type);
        bm =
          bullet.getComponent(BulletManager) ||
          bullet.addComponent(BulletManager);
        DataManager.Instance.bulletMap.set(id, bm);
        bm.init(data);
      } else {
        bm.render(data);
      }
    }
  }

  handleClientSync(input: IClientInput) {
    const msg = { input, frameId: DataManager.Instance.frameId++ };
    NetworkManager.Instance.sendMsg(ApiMsgEnum.MsgClientSync, msg);
  }

  handleServerSync({ inputs }: any) {
    for (const input of inputs) {
      DataManager.Instance.applyInput(input);
    }
  }
}
