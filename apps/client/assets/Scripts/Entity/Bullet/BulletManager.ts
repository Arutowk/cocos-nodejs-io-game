import {
  _decorator,
  Component,
  Node,
  Vec2,
  instantiate,
  IVec2,
  Vec3,
  Tween,
  tween,
} from "cc";
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

  private targetPos: Vec3;
  private tw: Tween<unknown>;

  init(data: IBullet) {
    this.type = data.type;
    this.id = data.id;
    this.fsm = this.addComponent(BulletStateMachine);
    this.fsm.init(data.type);

    this.state = EntityStateEnum.Idle;
    //子弹生成时先看不到
    this.node.active = false;
    this.targetPos = undefined;

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
    this.renderPos(data);
    this.renderDir(data);
  }

  renderPos(data: IBullet) {
    const newPos = new Vec3(data.position.x, data.position.y);
    if (!this.targetPos) {
      this.node.active = true;
      this.node.setPosition(newPos);
      this.targetPos = new Vec3(newPos);
    } else if (!this.targetPos.equals(newPos)) {
      this.tw?.stop();
      this.node.setPosition(this.targetPos);
      this.targetPos.set(newPos);
      this.tw = tween(this.node).to(0.1, { position: this.targetPos }).start();
    }
    this.node.setPosition(data.position.x, data.position.y);
  }

  renderDir(data: IBullet) {
    const { direction } = data;
    const side = Math.sqrt(direction.x ** 2 + direction.y ** 2);
    const angle =
      direction.x > 0
        ? rad2Angle(Math.asin(direction.y / side))
        : rad2Angle(Math.asin(-direction.y / side)) + 180;
    this.node.setRotationFromEuler(0, 0, angle);
  }
}
