import { _decorator, Component, Node, Label } from "cc";
import { IRoom } from "../Common";
const { ccclass, property } = _decorator;

@ccclass("RoomManager")
export class RoomManager extends Component {
  init({ id, players }: IRoom) {
    const label = this.getComponent(Label);
    label.string = `房间id${id}`;
    this.node.active = true;
  }
}
