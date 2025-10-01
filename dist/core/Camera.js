import { Vector2D } from './Vector2D.js';
/**
 * Camera that follows the player
 */
export class Camera {
    constructor(x = 0, y = 0) {
        this.smoothing = 0.1;
        this.position = new Vector2D(x, y);
        this.targetPosition = new Vector2D(x, y);
    }
    /**
     * Set the camera's target position (usually the player)
     */
    setTarget(x, y, screenWidth, screenHeight) {
        this.targetPosition.x = x - screenWidth / 2;
        this.targetPosition.y = y - screenHeight / 2;
    }
    /**
     * Smoothly move camera towards target
     */
    update() {
        this.position.x += (this.targetPosition.x - this.position.x) * this.smoothing;
        this.position.y += (this.targetPosition.y - this.position.y) * this.smoothing;
    }
}
//# sourceMappingURL=Camera.js.map