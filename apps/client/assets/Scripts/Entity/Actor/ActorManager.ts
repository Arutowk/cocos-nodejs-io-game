import { _decorator, Component, Node } from "cc";
import { InputTypeEnum } from "../../Common";
import DataManager from "../../Global/DataManager";
const { ccclass, property } = _decorator;

@ccclass("ActorManager")
export class ActorManager extends Component {
  onLoad() {}

  update(dt) {
    if (DataManager.Instance.jm.input.length()) {
      const { x, y } = DataManager.Instance.jm.input;
      DataManager.Instance.applyInput({
        type: InputTypeEnum.ActorMove,
        id: 1,
        direction: { x, y },
        dt,
      });

      console.log(
        DataManager.Instance.state.actors[0].position.x,
        DataManager.Instance.state.actors[0].position.y
      );
    }
  }
}
