import type { Game } from '../core/Game.js';
/**
 * Manages enemy spawning and wave progression
 */
export declare class WaveManager {
    private gameTime;
    private spawnTimer;
    private bossSpawned;
    private maxEnemies;
    private waves;
    update(deltaTime: number, game: Game): void;
    private getCurrentWave;
    private spawnEnemy;
    private spawnBoss;
    private getSpawnPosition;
    getGameTime(): number;
    getFormattedTime(): string;
}
//# sourceMappingURL=WaveManager.d.ts.map