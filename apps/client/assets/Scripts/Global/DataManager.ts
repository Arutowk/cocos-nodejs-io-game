import { Prefab } from "cc";
import Singleton from "../Base/Singleton";
import { EntityTypeEnum, IActorMove, IState } from "../Common";
import { ActorManager } from "../Entity/Actor/ActorManager";
import { JoyStickManager } from "../UI/JoyStickManager";

const ACTOR_SPEED = 100;

export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>();
  }

  state: IState = {
    actors: [
      {
        id: 1,
        type: EntityTypeEnum.Actor1,
        position: { x: 0, y: 0 },
        direction: { x: 1, y: 0 },
      },
    ],
  };
  jm: JoyStickManager;
  actorMap: Map<number, ActorManager> = new Map();
  prefabMap: Map<string, Prefab> = new Map();

  applyInput(input: IActorMove) {
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
  }
}
