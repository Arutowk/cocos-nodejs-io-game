import { _decorator, Component, Node } from "cc";
import { EventEnum } from "../Enum";
import EventManager from "../Global/EventManager";
const { ccclass, property } = _decorator;

@ccclass("ShootManager")
export class ShootManager extends Component {
  handleShoot() {
    EventManager.Instance.emit(EventEnum.WeaponShoot);
  }
}
