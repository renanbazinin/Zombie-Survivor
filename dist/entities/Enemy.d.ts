import { Entity } from '../core/Entity.js';
import { Vector2D } from '../core/Vector2D.js';
import type { Game } from '../core/Game.js';
export interface EnemyStats {
    maxHp: number;
    hp: number;
    damage: number;
    moveSpeed: number;
    xpValue: number;
    attackCooldown: number;
}
/**
 * Base class for all enemies
 */
export declare abstract class Enemy extends Entity {
    stats: EnemyStats;
    protected attackTimer: number;
    protected damageFlashTimer: number;
    protected color: string;
    constructor(x: number, y: number, radius: number, stats: EnemyStats);
    update(deltaTime: number, game: Game): void;
    protected attackPlayer(player: any): void;
    takeDamage(amount: number, game: Game): void;
    protected die(game: Game): void;
    protected dropXP(game: Game): void;
    render(ctx: CanvasRenderingContext2D, camera: Vector2D): void;
}
//# sourceMappingURL=Enemy.d.ts.map