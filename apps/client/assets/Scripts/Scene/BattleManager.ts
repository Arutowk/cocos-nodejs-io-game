import { _decorator, Component, Node, Prefab, instantiate } from "cc";
import { EntityTypeEnum } from "../Common";
import { ActorManager } from "../Entity/Actor/ActorManager";
import { PrefabPathEnum } from "../Enum";
import DataManager from "../Global/DataManager";
import { ResourceManager } from "../Global/ResourceManager";
import { JoyStickManager } from "../UI/JoyStickManager";
const { ccclass, property } = _decorator;

@ccclass("BattleManager")
export class BattleManager extends Component {
  private stage: Node;
  private ui: Node;
  private shouldUpdate = false;

  onLoad() {
    this.stage = this.node.getChildByName("Stage");
    this.ui = this.node.getChildByName("UI");
    this.stage.destroyAllChildren();
    DataManager.Instance.jm = this.ui.getComponentInChildren(JoyStickManager);
  }

  async start() {
    await this.loadRes();
    this.initMap();
    this.shouldUpdate = true;
  }

  async loadRes() {
    const list = [];
    //枚举编译为js其实就是对象
    for (const type in PrefabPathEnum) {
      const p = ResourceManager.Instance.loadRes(
        PrefabPathEnum[type],
        Prefab
      ).then((prefab) => {
        DataManager.Instance.prefabMap.set(type, prefab);
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

  update() {
    if (!this.shouldUpdate) return;
    this.render();
  }

  render() {
    this.renderActor();
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
}
