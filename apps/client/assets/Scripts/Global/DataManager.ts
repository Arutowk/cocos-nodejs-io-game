import { Prefab, SpriteFrame, Node } from "cc";
import Singleton from "../Base/Singleton";
import {
  EntityTypeEnum,
  IActorMove,
  IBullet,
  IClientInput,
  InputTypeEnum,
  IState,
} from "../Common";
import { ActorManager } from "../Entity/Actor/ActorManager";
import { BulletManager } from "../Entity/Bullet/BulletManager";
import { JoyStickManager } from "../UI/JoyStickManager";

const ACTOR_SPEED = 100;
const BULLET_SPEED = 600;

const mapW = 960;
const mapH = 640;

export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>();
  }

  state: IState = {
    actors: [
      {
        id: 1,
        type: EntityTypeEnum.Actor1,
        weaponType: EntityTypeEnum.Weapon1,
        bulletType: EntityTypeEnum.Bullet2,
        position: { x: 0, y: 0 },
        direction: { x: 1, y: 0 },
      },
    ],
    bullets: [],
    nextBulletId: 1,
  };
  stage: Node;
  jm: JoyStickManager;
  actorMap: Map<number, ActorManager> = new Map();
  prefabMap: Map<string, Prefab> = new Map();
  textureMap: Map<string, SpriteFrame[]> = new Map();
  bulletMap: Map<number, BulletManager> = new Map();

  //根据joystick的输入来移动角色
  applyInput(input: IClientInput) {
    switch (input.type) {
      case InputTypeEnum.ActorMove: {
        const {
          id,
          dt,
          direction: { x, y },
        } = input;
        const actor = this.state.actors.find((e) => e.id === id);
        actor.direction.x = x;
        actor.direction.y = y;

        actor.position.x += x * dt * ACTOR_SPEED;
        actor.position.y += y * dt * ACTOR_SPEED;
        break;
      }

      case InputTypeEnum.WeaponShoot: {
        const { owner, position, direction } = input;
        const bullet: IBullet = {
          id: this.state.nextBulletId++,
          owner,
          position,
          direction,
          type: this.actorMap.get(owner).bulletType,
        };
        this.state.bullets.push(bullet);
        break;
      }
      case InputTypeEnum.TimePast: {
        const { dt } = input;
        const { bullets } = this.state;

        for (let i = bullets.length - 1; i >= 0; i--) {
          const bullet = bullets[i];
          if (
            Math.abs(bullet.position.x) > mapW / 2 ||
            Math.abs(bullet.position.y) > mapH / 2
          ) {
            bullets.splice(i, 1);
          }
        }

        for (const bullet of bullets) {
          bullet.position.x += bullet.direction.x * dt * BULLET_SPEED;
          bullet.position.y += bullet.direction.y * dt * BULLET_SPEED;
        }
        break;
      }
      default:
        break;
    }
  }
}
