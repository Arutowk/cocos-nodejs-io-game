import { _decorator, Component, Node } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { IActor, InputTypeEnum } from "../../Common";
import { EntityStateEnum } from "../../Enum";
import DataManager from "../../Global/DataManager";
import { ActorStateMachine } from "./ActorStateMachine";
const { ccclass, property } = _decorator;

@ccclass("ActorManager")
export class ActorManager extends EntityManager {
  init(data: IActor) {
    this.fsm = this.addComponent(ActorStateMachine);
    this.fsm.init(data.type);

    this.state = EntityStateEnum.Idle;
  }

  tick(dt) {
    if (DataManager.Instance.jm.input.length()) {
      const { x, y } = DataManager.Instance.jm.input;
      DataManager.Instance.applyInput({
        type: InputTypeEnum.ActorMove,
        id: 1,
        direction: { x, y },
        dt,
      });

      this.state = EntityStateEnum.Run;
    } else {
      this.state = EntityStateEnum.Idle;
    }
  }

  render(data: IActor) {
    const { direction, position } = data;
    this.node.setPosition(position.x, position.y);

    //根据左右方向不同翻转人物贴图
    if (direction.x !== 0) {
      this.node.setScale(direction.x > 0 ? 1 : -1, 1);
    }
  }
}
