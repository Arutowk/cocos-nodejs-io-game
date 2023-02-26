import { _decorator, Component, Node, EditBox, director } from "cc";
import { ApiMsgEnum } from "../Common";
import { SceneEnum } from "../Enum";
import DataManager from "../Global/DataManager";
import { NetworkManager } from "../Global/NetworkManager";
const { ccclass, property } = _decorator;

@ccclass("LoginManager")
export class LoginManager extends Component {
  input: EditBox;

  onLoad() {
    this.input = this.getComponentInChildren(EditBox);
    director.preloadScene(SceneEnum.Hall);
  }

  async start() {
    await NetworkManager.Instance.connect();
  }

  async handleClick() {
    if (!NetworkManager.Instance.isConnected) {
      console.log("未连接");
      await NetworkManager.Instance.connect();
      return;
    }
    const nickname = this.input.string;
    if (!nickname) {
      console.log("未输入昵称");
      return;
    }

    const { success, error, res } = await NetworkManager.Instance.callApi(
      ApiMsgEnum.ApiPlayerJoin,
      { nickname }
    );
    if (!success) {
      console.log(error);
      return;
    }
    DataManager.Instance.myPlayerId = res.player.id;
    console.log("res!", res);
    director.loadScene(SceneEnum.Hall);
  }
}
