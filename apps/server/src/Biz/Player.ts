import { Connection } from "../Core";

export class Player {
  id: number;
  nickname: string;
  connection: Connection;
  rid: number;

  constructor({
    id,
    nickname,
    connection,
  }: Pick<Player, "id" | "connection" | "nickname">) {
    this.id = id;
    this.connection = connection;
    this.nickname = nickname;
  }
}
