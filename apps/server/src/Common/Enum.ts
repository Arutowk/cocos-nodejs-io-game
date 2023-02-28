export enum InputTypeEnum {
  ActorMove = "ActorMove",
  WeaponShoot = "WeaponShoot",
  TimePast = "TimePast",
}

export enum EntityTypeEnum {
  Actor1 = "Actor1",
  Map = "Map",
  Weapon1 = "Weapon1",
  Bullet1 = "Bullet1",
  Bullet2 = "Bullet2",
  Explosion = "Explosion",
}

export enum ApiMsgEnum {
  ApiPlayerJoin = "ApiPlayerJoin",
  ApiPlayerList = "ApiPlayerList",
  ApiRoomCreate = "ApiRoomCreate",
  ApiRoomList = "ApiRoomList",
  ApiRoomJoin = "ApiRoomJoin",
  ApiRoomLeave = "ApiRoomLeave",
  ApiGameStart = "ApiGameStart",
  MsgPlayerList = "MsgPlayerList",
  MsgRoomList = "MsgRoomList",
  MsgRoom = "MsgRoom",
  MsgGameStart = "MsgGameStart",
  MsgClientSync = "MsgClientSync",
  MsgServerSync = "MsgServerSync",
}
