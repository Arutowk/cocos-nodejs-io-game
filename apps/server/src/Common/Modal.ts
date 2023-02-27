import {
  IApiPlayerJoinReq,
  IApiPlayerJoinRes,
  IApiPlayerListReq,
  IApiPlayerListRes,
  IApiRoomCreateReq,
  IApiRoomCreateRes,
  IApiRoomListReq,
  IApiRoomListRes,
} from "./Api";
import { ApiMsgEnum } from "./Enum";
import {
  IMsgClientSync,
  IMsgPlayerList,
  IMsgRoomList,
  IMsgServerSync,
} from "./Msg";

export interface IModel {
  api: {
    [ApiMsgEnum.ApiPlayerJoin]: {
      req: IApiPlayerJoinReq;
      res: IApiPlayerJoinRes;
    };
    [ApiMsgEnum.ApiPlayerList]: {
      req: IApiPlayerListReq;
      res: IApiPlayerListRes;
    };
    [ApiMsgEnum.ApiRoomCreate]: {
      req: IApiRoomCreateReq;
      res: IApiRoomCreateRes;
    };
    [ApiMsgEnum.ApiRoomList]: {
      req: IApiRoomListReq;
      res: IApiRoomListRes;
    };
  };
  msg: {
    [ApiMsgEnum.MsgPlayerList]: IMsgPlayerList;
    [ApiMsgEnum.MsgRoomList]: IMsgRoomList;
    [ApiMsgEnum.MsgClientSync]: IMsgClientSync;
    [ApiMsgEnum.MsgServerSync]: IMsgServerSync;
  };
}
