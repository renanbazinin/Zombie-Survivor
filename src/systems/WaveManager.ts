import type { Game } from '../core/Game.js';
import { Walker } from '../entities/enemies/Walker.js';
import { Runner } from '../entities/enemies/Runner.js';
import { Boss } from '../entities/enemies/Boss.js';

interface WaveConfig {
    startTime: number;
    endTime: number;
    spawnRate: number; // enemies per second
    enemyTypes: Array<{ type: string; weight: number }>;
}

/**
 * Manages enemy spawning and wave progression
 */
export class WaveManager {
    private gameTime: number = 0;
    private spawnTimer: number = 0;
    private bossSpawned: boolean = false;
    private maxEnemies: number = 60;
    
    private waves: WaveConfig[] = [
        {
            startTime: 0,
            endTime: 120, // 0:00 - 2:00
            spawnRate: 8,
            enemyTypes: [{ type: 'walker', weight: 1 }]
        },
        {
            startTime: 120,
            endTime: 180, // 2:00 - 3:00
            spawnRate: 12,
            enemyTypes: [
                { type: 'walker', weight: 0.7 },
                { type: 'runner', weight: 0.3 }
            ]
        },
        {
            startTime: 180,
            endTime: 300, // 3:00 - 5:00 (boss at 3:00)
            spawnRate: 10,
            enemyTypes: [
                { type: 'walker', weight: 0.6 },
                { type: 'runner', weight: 0.4 }
            ]
        },
        {
            startTime: 300,
            endTime: 420, // 5:00 - 7:00
            spawnRate: 15,
            enemyTypes: [
                { type: 'walker', weight: 0.5 },
                { type: 'runner', weight: 0.5 }
            ]
        },
        {
            startTime: 420,
            endTime: 720, // 7:00+
            spawnRate: 20,
            enemyTypes: [
                { type: 'walker', weight: 0.4 },
                { type: 'runner', weight: 0.6 }
            ]
        }
    ];

    update(deltaTime: number, game: Game): void {
        this.gameTime += deltaTime;
        
        // Check for boss spawn at 3:00
        if (this.gameTime >= 180 && !this.bossSpawned) {
            this.spawnBoss(game);
            this.bossSpawned = true;
        }
        
        // Don't spawn regular enemies if at max
        if (game.enemies.length >= this.maxEnemies) {
            return;
        }
        
        // Get current wave config
        const waveConfig = this.getCurrentWave();
        if (!waveConfig) return;
        
        // Spawn enemies based on spawn rate
        this.spawnTimer += deltaTime;
        const spawnInterval = 1 / waveConfig.spawnRate;
        
        while (this.spawnTimer >= spawnInterval && game.enemies.length < this.maxEnemies) {
            this.spawnTimer -= spawnInterval;
            this.spawnEnemy(waveConfig, game);
        }
    }

    private getCurrentWave(): WaveConfig | null {
        for (const wave of this.waves) {
            if (this.gameTime >= wave.startTime && this.gameTime < wave.endTime) {
                return wave;
            }
        }
        
        // Return last wave if past all waves
        return this.waves[this.waves.length - 1];
    }

    private spawnEnemy(waveConfig: WaveConfig, game: Game): void {
        // Choose enemy type based on weights
        const totalWeight = waveConfig.enemyTypes.reduce((sum, et) => sum + et.weight, 0);
        let random = Math.random() * totalWeight;
        
        let enemyType = 'walker';
        for (const et of waveConfig.enemyTypes) {
            random -= et.weight;
            if (random <= 0) {
                enemyType = et.type;
                break;
            }
        }
        
        // Spawn at random position outside screen
        const spawnPos = this.getSpawnPosition(game);
        
        let enemy;
        switch (enemyType) {
            case 'runner':
                enemy = new Runner(spawnPos.x, spawnPos.y);
                break;
            default:
                enemy = new Walker(spawnPos.x, spawnPos.y);
                break;
        }
        
        game.enemies.push(enemy);
    }

    private spawnBoss(game: Game): void {
        const spawnPos = this.getSpawnPosition(game);
        const boss = new Boss(spawnPos.x, spawnPos.y);
        game.enemies.push(boss);
    }

    private getSpawnPosition(game: Game): { x: number; y: number } {
        const player = game.player;
        const spawnDistance = 400;
        
        const angle = Math.random() * Math.PI * 2;
        const x = player.position.x + Math.cos(angle) * spawnDistance;
        const y = player.position.y + Math.sin(angle) * spawnDistance;
        
        return { x, y };
    }

    getGameTime(): number {
        return this.gameTime;
    }

    getFormattedTime(): string {
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = Math.floor(this.gameTime % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

