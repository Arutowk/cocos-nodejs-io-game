import { EntityTypeEnum, InputTypeEnum } from "./Enum";

export interface IVec2 {
  x: number;
  y: number;
}

export interface IActor {
  id: number;
  position: IVec2;
  direction: IVec2;
  type: EntityTypeEnum;
  weaponType: EntityTypeEnum;
}

export interface IState {
  actors: IActor[];
}

export interface IActorMove {
  type: InputTypeEnum.ActorMove;
  id: number;
  direction: IVec2;
  dt: number;
}
