import Singleton from "../Base/Singleton";
import { Player } from "./Player";

export class PlayerManager extends Singleton {
  static get Instance() {
    return super.GetInstance<PlayerManager>();
  }

  nextPlayerId: number = 1;

  player: Set<Player> = new Set();
  idMapPlayer: Map<number, Player> = new Map();

  createPlayer({ nickname, connection }: any) {
    const player = new Player({
      id: this.nextPlayerId++,
      nickname,
      connection,
    });
    this.player.add(player);
    this.idMapPlayer.set(player.id, player);
    return player;
  }

  removePlayer(pid: number) {
    const player = this.idMapPlayer.get(pid);
    if (player) {
      this.player.delete(player);
      this.idMapPlayer.delete(player.id);
    }
  }

  getPlayerView({ id, nickname, rid }: Player) {
    return { id, nickname, rid };
  }
}
