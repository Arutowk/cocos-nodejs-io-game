import { IPlayer } from "./Api";
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
