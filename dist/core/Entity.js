import { Vector2D } from './Vector2D.js';
/**
 * Base class for all game entities (players, enemies, projectiles, etc.)
 */
export class Entity {
    constructor(x, y, radius) {
        this.isDead = false;
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
        this.radius = radius;
    }
    /**
     * Mark this entity for removal
     */
    kill() {
        this.isDead = true;
    }
    /**
     * Check collision with another entity (circle collision)
     */
    collidesWith(other) {
        const distance = this.position.distanceSquaredTo(other.position);
        const radiusSum = this.radius + other.radius;
        return distance < radiusSum * radiusSum;
    }
    /**
     * Get screen position relative to camera
     */
    getScreenPosition(camera) {
        return new Vector2D(this.position.x - camera.x, this.position.y - camera.y);
    }
}
//# sourceMappingURL=Entity.js.map