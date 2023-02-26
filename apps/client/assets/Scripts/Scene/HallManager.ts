import { _decorator, Component, Node, Prefab, instantiate } from "cc";
import { ApiMsgEnum, IApiPlayerListRes } from "../Common";
import { NetworkManager } from "../Global/NetworkManager";
import { PlayerManager } from "../UI/PlayerManager";
const { ccclass, property } = _decorator;

@ccclass("HallManager")
export class HallManager extends Component {
  @property(Node)
  playerContainer: Node;

  @property(Prefab)
  playerPrefab: Prefab;

  start() {
    NetworkManager.Instance.listenMsg(
      ApiMsgEnum.MsgPlayerList,
      this.renderPlayer,
      this
    );
    this.playerContainer.destroyAllChildren();
    this.getPlayer();
  }

  onDestroy() {
    NetworkManager.Instance.unlistenMsg(
      ApiMsgEnum.MsgPlayerList,
      this.renderPlayer,
      this
    );
  }

  async getPlayer() {
    const { success, error, res } = await NetworkManager.Instance.callApi(
      ApiMsgEnum.ApiPlayerList,
      {}
    );
    if (!success) {
      console.log(error);
      return;
    }
    console.log("res", res);
    this.renderPlayer(res);
  }

  renderPlayer({ list }: IApiPlayerListRes) {
    for (const c of this.playerContainer.children) {
      c.active = false;
    }
    while (this.playerContainer.children.length < list.length) {
      const node = instantiate(this.playerPrefab);
      node.active = false;
      node.setParent(this.playerContainer);
    }
    console.log("list", list);
    for (let i = 0; i < list.length; i++) {
      const data = list[i];
      const node = this.playerContainer.children[i];
      node.getComponent(PlayerManager).init(data);
    }
  }
}
