import { Player } from '../entities/Player.js';
import { InputManager } from './InputManager.js';
import { Camera } from './Camera.js';
import { WaveManager } from '../systems/WaveManager.js';
import { UIManager } from '../systems/UIManager.js';
import type { Enemy } from '../entities/Enemy.js';
import type { Projectile } from '../entities/Projectile.js';
import type { Pickup } from '../entities/Pickup.js';
/**
 * Main game class that manages all systems
 */
export declare class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    player: Player;
    input: InputManager;
    camera: Camera;
    waveManager: WaveManager;
    ui: UIManager;
    enemies: Enemy[];
    projectiles: Projectile[];
    pickups: Pickup[];
    paused: boolean;
    gameOver: boolean;
    private lastTime;
    constructor(canvas: HTMLCanvasElement);
    /**
     * Start the game loop
     */
    start(): void;
    /**
     * Main game loop
     */
    private gameLoop;
    /**
     * Update all game systems
     */
    private update;
    /**
     * Render the game
     */
    private render;
    private drawBackground;
    private drawDebugInfo;
    private triggerGameOver;
}
//# sourceMappingURL=Game.d.ts.map