import { Vector2D } from './Vector2D.js';
import type { Game } from './Game.js';

/**
 * Base class for all game entities (players, enemies, projectiles, etc.)
 */
export abstract class Entity {
    public position: Vector2D;
    public velocity: Vector2D;
    public radius: number;
    public isDead: boolean = false;
    
    constructor(x: number, y: number, radius: number) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
        this.radius = radius;
    }

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
    kill(): void {
        this.isDead = true;
    }

    /**
     * Check collision with another entity (circle collision)
     */
    collidesWith(other: Entity): boolean {
        const distance = this.position.distanceSquaredTo(other.position);
        const radiusSum = this.radius + other.radius;
        return distance < radiusSum * radiusSum;
    }

    /**
     * Get screen position relative to camera
     */
    getScreenPosition(camera: Vector2D): Vector2D {
        return new Vector2D(
            this.position.x - camera.x,
            this.position.y - camera.y
        );
    }
}


