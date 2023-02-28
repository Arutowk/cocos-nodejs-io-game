import {
  _decorator,
  Component,
  Node,
  instantiate,
  ProgressBar,
  Vec3,
  Tween,
  tween,
} from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { EntityTypeEnum, IActor, InputTypeEnum, toFixed } from "../../Common";
import { EntityStateEnum, EventEnum } from "../../Enum";
import DataManager from "../../Global/DataManager";
import EventManager from "../../Global/EventManager";
import { rad2Angle } from "../../Utils";
import { WeaponManager } from "../Weapon/WeaponManager";
import { ActorStateMachine } from "./ActorStateMachine";
const { ccclass, property } = _decorator;

@ccclass("ActorManager")
export class ActorManager extends EntityManager {
  id: number;
  bulletType: EntityTypeEnum;

  private hp: ProgressBar;
  private wm: WeaponManager;
  private targetPos: Vec3;
  private tw: Tween<unknown>;

  init(data: IActor) {
    this.id = data.id;
    this.bulletType = data.bulletType;
    this.hp = this.node.getComponentInChildren(ProgressBar);
    this.fsm = this.addComponent(ActorStateMachine);
    this.fsm.init(data.type);

    this.state = EntityStateEnum.Idle;
    this.node.active = false;
    this.targetPos = undefined;

    const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Weapon1);
    const weapon = instantiate(prefab);
    weapon.setParent(this.node);
    this.wm = weapon.addComponent(WeaponManager);
    this.wm.init(data);
  }

  tick(dt) {
    if (this.id !== DataManager.Instance.myPlayerId) return;
    if (DataManager.Instance.jm.input.length()) {
      const { x, y } = DataManager.Instance.jm.input;

      EventManager.Instance.emit(EventEnum.ClientSync, {
        type: InputTypeEnum.ActorMove,
        id: DataManager.Instance.myPlayerId,
        direction: { x: toFixed(x), y: toFixed(y) },
        dt: toFixed(dt),
      });
    } else {
      this.state = EntityStateEnum.Idle;
    }
  }

  render(data: IActor) {
    this.renderPos(data);
    this.renderDir(data);
    this.renderHP(data);
  }

  renderPos(data: IActor) {
    const newPos = new Vec3(data.position.x, data.position.y);
    if (!this.targetPos) {
      this.node.active = true;
      this.node.setPosition(newPos);
      this.targetPos = new Vec3(newPos);
    } else if (!this.targetPos.equals(newPos)) {
      this.tw?.stop();
      this.node.setPosition(this.targetPos);
      this.targetPos.set(newPos);
      this.state = EntityStateEnum.Run;
      this.tw = tween(this.node)
        .to(0.1, { position: this.targetPos })
        .call(() => {
          this.state = EntityStateEnum.Idle;
        })
        .start();
    }
    this.node.setPosition(data.position.x, data.position.y);
  }

  renderDir(data: IActor) {
    //根据左右方向不同翻转人物贴图
    if (data.direction.x !== 0) {
      this.node.setScale(data.direction.x > 0 ? 1 : -1, 1);
      this.hp.node.setScale(data.direction.x > 0 ? 1 : -1, 1);
    }
    const side = Math.sqrt(data.direction.x ** 2 + data.direction.y ** 2);
    const rad = Math.asin(data.direction.y / side);
    const angle = rad2Angle(rad);

    this.wm.node.setRotationFromEuler(0, 0, angle);
  }

  renderHP(data: IActor) {
    this.hp.progress = data.hp / this.hp.totalLength;
  }
}
