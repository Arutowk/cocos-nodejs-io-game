import {
  _decorator,
  Component,
  Node,
  instantiate,
  UITransform,
  Vec2,
} from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { IActor, InputTypeEnum } from "../../Common";
import { EntityStateEnum, EventEnum } from "../../Enum";
import DataManager from "../../Global/DataManager";
import EventManager from "../../Global/EventManager";
import { WeaponStateMachine } from "./WeaponStateMachine";
const { ccclass, property } = _decorator;

@ccclass("WeaponManager")
export class WeaponManager extends EntityManager {
  owner: number;
  private body: Node;
  private anchor: Node;
  private point: Node;

  init(data: IActor) {
    this.owner = data.id;
    this.body = this.node.getChildByName("Body");
    this.anchor = this.body.getChildByName("Anchor");
    this.point = this.anchor.getChildByName("Point");

    this.fsm = this.body.addComponent(WeaponStateMachine);
    this.fsm.init(data.weaponType);

    this.state = EntityStateEnum.Idle;

    EventManager.Instance.on(
      EventEnum.WeaponShoot,
      this.handleWeaponShoot,
      this
    );
  }

  onDestroy() {
    EventManager.Instance.off(
      EventEnum.WeaponShoot,
      this.handleWeaponShoot,
      this
    );
  }

  handleWeaponShoot() {
    const pointWorldPos = this.point.getWorldPosition();
    const pointStagePos = DataManager.Instance.stage
      .getComponent(UITransform)
      .convertToNodeSpaceAR(pointWorldPos);

    const anchorWorldPos = this.anchor.getWorldPosition();
    const direction = new Vec2(
      pointWorldPos.x - anchorWorldPos.x,
      pointWorldPos.y - anchorWorldPos.y
    ).normalize();
    DataManager.Instance.applyInput({
      type: InputTypeEnum.WeaponShoot,
      owner: this.owner,
      position: { x: pointStagePos.x, y: pointStagePos.y },
      direction: { x: direction.x, y: direction.y },
    });
    console.log(DataManager.Instance.state.bullets);
  }
}
