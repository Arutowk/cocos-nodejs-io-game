import { _decorator, Component, Node } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { EntityTypeEnum, IActor, IBullet } from "../../Common";
import { EntityStateEnum } from "../../Enum";
import { rad2Angle } from "../../Utils";
import { BulletStateMachine } from "./BulletStateMachine";
const { ccclass, property } = _decorator;

@ccclass("BulletManager")
export class BulletManager extends EntityManager {
  type: EntityTypeEnum;

  init(data: IBullet) {
    this.type = data.type;
    this.fsm = this.addComponent(BulletStateMachine);
    this.fsm.init(data.type);

    this.state = EntityStateEnum.Idle;
    //子弹生成时先看不到
    this.node.active = false;
  }

  render(data: IBullet) {
    this.node.active = true;
    const { direction, position } = data;
    this.node.setPosition(position.x, position.y);

    const side = Math.sqrt(direction.x ** 2 + direction.y ** 2);
    const angle =
      direction.x > 0
        ? rad2Angle(Math.asin(direction.y / side))
        : rad2Angle(Math.asin(-direction.y / side)) + 180;

    this.node.setRotationFromEuler(0, 0, angle);
  }
}
