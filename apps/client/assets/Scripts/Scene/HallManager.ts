import { _decorator, Component, Node, Prefab, instantiate, director } from "cc";
import { ApiMsgEnum, IApiPlayerListRes, IApiRoomListRes } from "../Common";
import { SceneEnum } from "../Enum";
import DataManager from "../Global/DataManager";
import { NetworkManager } from "../Global/NetworkManager";
import { PlayerManager } from "../UI/PlayerManager";
import { RoomManager } from "../UI/RoomManager";
const { ccclass, property } = _decorator;

@ccclass("HallManager")
export class HallManager extends Component {
  @property(Node)
  playerContainer: Node;

  @property(Prefab)
  playerPrefab: Prefab;

  @property(Node)
  roomContainer: Node;

  @property(Prefab)
  roomPrefab: Prefab;

  onLoad() {
    NetworkManager.Instance.listenMsg(
      ApiMsgEnum.MsgPlayerList,
      this.renderPlayer,
      this
    );
    NetworkManager.Instance.listenMsg(
      ApiMsgEnum.MsgRoomList,
      this.renderRoom,
      this
    );
  }

  start() {
    this.playerContainer.destroyAllChildren();
    this.roomContainer.destroyAllChildren();
    this.getPlayer();
    this.getRooms();
  }

  onDestroy() {
    NetworkManager.Instance.unlistenMsg(
      ApiMsgEnum.MsgPlayerList,
      this.renderPlayer,
      this
    );
    NetworkManager.Instance.unlistenMsg(
      ApiMsgEnum.MsgRoomList,
      this.renderRoom,
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
    // console.log("list", list);
    for (let i = 0; i < list.length; i++) {
      const data = list[i];
      const node = this.playerContainer.children[i];
      node.getComponent(PlayerManager).init(data);
    }
  }

  renderRoom({ list }: IApiRoomListRes) {
    for (const c of this.roomContainer.children) {
      c.active = false;
    }
    while (this.roomContainer.children.length < list.length) {
      const node = instantiate(this.roomPrefab);
      node.active = false;
      node.setParent(this.roomContainer);
    }
    console.log("list", list);
    for (let i = 0; i < list.length; i++) {
      const data = list[i];
      const node = this.roomContainer.children[i];
      node.getComponent(RoomManager).init(data);
    }
  }

  async getRooms() {
    const { success, error, res } = await NetworkManager.Instance.callApi(
      ApiMsgEnum.ApiRoomList,
      {}
    );
    if (!success) {
      console.log(error);
      return;
    }
    console.log("res", res);
    this.renderRoom(res);
  }

  async handleCreateRoom() {
    const { success, error, res } = await NetworkManager.Instance.callApi(
      ApiMsgEnum.ApiRoomCreate,
      {}
    );
    if (!success) {
      console.log(error);
      return;
    }
    DataManager.Instance.roomInfo = res.room;
    console.log("res", res);
    director.loadScene(SceneEnum.Room);
  }
}
