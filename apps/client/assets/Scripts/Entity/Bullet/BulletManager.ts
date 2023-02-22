import { _decorator, Component, Node, Vec2, instantiate, IVec2 } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { EntityTypeEnum, IActor, IBullet } from "../../Common";
import { EntityStateEnum, EventEnum } from "../../Enum";
import DataManager from "../../Global/DataManager";
import EventManager from "../../Global/EventManager";
import { ObjectPoolManager } from "../../Global/ObjectPoolManager";
import { rad2Angle } from "../../Utils";
import { ExplosionManager } from "../Explotion/ExplosionManager";
import { BulletStateMachine } from "./BulletStateMachine";
const { ccclass, property } = _decorator;

@ccclass("BulletManager")
export class BulletManager extends EntityManager {
  type: EntityTypeEnum;
  id: number;

  init(data: IBullet) {
    this.type = data.type;
    this.id = data.id;
    this.fsm = this.addComponent(BulletStateMachine);
    this.fsm.init(data.type);

    this.state = EntityStateEnum.Idle;
    //子弹生成时先看不到
    this.node.active = false;

    EventManager.Instance.on(
      EventEnum.ExplosionBorn,
      this.handleExplosionBorn,
      this
    );
  }

  handleExplosionBorn(id: number, { x, y }: IVec2) {
    if (id !== this.id) return;
    const explosion = ObjectPoolManager.Instance.get(EntityTypeEnum.Explosion);

    const em =
      explosion.getComponent(ExplosionManager) ||
      explosion.addComponent(ExplosionManager);
    em.init(EntityTypeEnum.Explosion, { x, y });

    EventManager.Instance.off(
      EventEnum.ExplosionBorn,
      this.handleExplosionBorn,
      this
    );
    DataManager.Instance.bulletMap.delete(this.id);
    ObjectPoolManager.Instance.ret(this.node);
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
