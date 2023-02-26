export enum FsmParamTypeEnum {
  Number = "Number",
  Trigger = "Trigger",
}

export enum ParamsNameEnum {
  Idle = "Idle",
  Run = "Run",
  Attack = "Attack",
}

export enum EventEnum {
  WeaponShoot = "WeaponShoot",
  ExplosionBorn = "ExplosionBorn",
  BulletBorn = "BulletBorn",
  ClientSync = "ClientSync",
}

export enum PrefabPathEnum {
  Map = "prefab/Map",
  Actor1 = "prefab/Actor",
  Weapon1 = "prefab/Weapon1",
  Bullet2 = "prefab/Bullet2",
  Explosion = "prefab/Explosion",
}

export enum TexturePathEnum {
  Actor1Idle = "texture/actor/actor1/idle",
  Actor1Run = "texture/actor/actor1/run",
  Weapon1Idle = "texture/weapon/weapon1/idle",
  Weapon1Attack = "texture/weapon/weapon1/attack",
  Bullet2Idle = "texture/bullet/bullet2",
  ExplosionIdle = "texture/explosion",
}

export enum EntityStateEnum {
  Idle = "Idle",
  Run = "Run",
  Attack = "Attack",
}

export enum SceneEnum {
  Login = "Login",
  Battle = "Battle",
  Hall = "Hall",
}
