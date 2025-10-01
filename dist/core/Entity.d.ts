import { Vector2D } from './Vector2D.js';
import type { Game } from './Game.js';
/**
 * Base class for all game entities (players, enemies, projectiles, etc.)
 */
export declare abstract class Entity {
    position: Vector2D;
    velocity: Vector2D;
    radius: number;
    isDead: boolean;
    constructor(x: number, y: number, radius: number);
    /**
     * Update the entity's state
     */
    abstract update(deltaTime: number, game: Game): void;
    /**
     * Render the entity
     */
    abstract render(ctx: CanvasRenderingContext2D, camera: Vector2D): void;
    /**
     * Mark this entity for removal
     */
    kill(): void;
    /**
     * Check collision with another entity (circle collision)
     */
    collidesWith(other: Entity): boolean;
    /**
     * Get screen position relative to camera
     */
    getScreenPosition(camera: Vector2D): Vector2D;
}
//# sourceMappingURL=Entity.d.ts.map