import { Entity } from '../core/Entity.js';
import { Vector2D } from '../core/Vector2D.js';
import type { Game } from '../core/Game.js';
/**
 * Projectile fired by weapons
 */
export declare class Projectile extends Entity {
    private direction;
    private speed;
    private damage;
    private maxRange;
    private distanceTraveled;
    private pierce;
    private hitEnemies;
    private color;
    constructor(x: number, y: number, angle: number, speed: number, damage: number, maxRange: number, pierce: number, color: string);
    update(deltaTime: number, game: Game): void;
    render(ctx: CanvasRenderingContext2D, camera: Vector2D): void;
}
//# sourceMappingURL=Projectile.d.ts.map