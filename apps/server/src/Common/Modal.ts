import {
  IApiPlayerJoinReq,
  IApiPlayerJoinRes,
  IApiPlayerListReq,
  IApiPlayerListRes,
} from "./Api";
import { ApiMsgEnum } from "./Enum";
import { IMsgClientSync, IMsgPlayerList, IMsgServerSync } from "./Msg";

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
  };
  msg: {
    [ApiMsgEnum.MsgPlayerList]: IMsgPlayerList;
    [ApiMsgEnum.MsgClientSync]: IMsgClientSync;
    [ApiMsgEnum.MsgServerSync]: IMsgServerSync;
  };
}
