import Singleton from "../Base/Singleton";
import { IActorMove, IState } from "../Common";
import { JoyStickManager } from "../UI/JoyStickManager";

const ACTOR_SPEED = 100;

export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>();
  }

  state: IState = {
    actors: [{ id: 1, position: { x: 0, y: 0 }, direction: { x: 1, y: 0 } }],
  };
  jm: JoyStickManager;

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
