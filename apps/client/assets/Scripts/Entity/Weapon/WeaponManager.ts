import { _decorator, Component, Node, instantiate } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { EntityTypeEnum, IActor } from "../../Common";
import { EntityStateEnum } from "../../Enum";
import DataManager from "../../Global/DataManager";
import { ActorStateMachine } from "../Actor/ActorStateMachine";
import { WeaponStateMachine } from "./WeaponStateMachine";
const { ccclass, property } = _decorator;

@ccclass("WeaponManager")
export class WeaponManager extends EntityManager {
  private body: Node;
  private anchor: Node;
  private point: Node;

  init(data: IActor) {
    this.body = this.node.getChildByName("Body");
    this.anchor = this.body.getChildByName("Anchor");
    this.point = this.anchor.getChildByName("Point");

    this.fsm = this.body.addComponent(WeaponStateMachine);
    this.fsm.init(data.weaponType);

    this.state = EntityStateEnum.Idle;
  }
}
