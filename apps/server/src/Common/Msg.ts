import { IPlayer, IRoom } from "./Api";
import { IClientInput } from "./State";

export interface IMsgClientSync {
  input: IClientInput;
  frameId: number;
}

export interface IMsgServerSync {
  inputs: IClientInput[];
  lastFrameId: number;
}

export interface IMsgPlayerList {
  list: IPlayer[];
}

export interface IMsgRoomList {
  list: IRoom[];
}
