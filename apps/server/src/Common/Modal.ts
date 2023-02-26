import { IApiPlayerJoinReq, IApiPlayerJoinRes } from "./Api";
import { ApiMsgEnum } from "./Enum";
import { IMsgClientSync, IMsgServerSync } from "./Msg";

export interface IModel {
  api: {
    [ApiMsgEnum.ApiPlayerJoin]: {
      req: IApiPlayerJoinReq;
      res: IApiPlayerJoinRes;
    };
  };
  msg: {
    [ApiMsgEnum.MsgClientSync]: IMsgClientSync;
    [ApiMsgEnum.MsgServerSync]: IMsgServerSync;
  };
}
