export interface IPlayer {
  id: number;
  nickname: string;
  rid: number;
}

export interface IApiPlayerJoinReq {
  nickname: string;
}

export interface IApiPlayerJoinRes {
  player: IPlayer;
}

export interface IApiPlayerListReq {}

export interface IApiPlayerListRes {
  list: IPlayer[];
}
