import { Vector2D } from './Vector2D.js';

/**
 * Camera that follows the player
 */
export class Camera {
    public position: Vector2D;
    private targetPosition: Vector2D;
    private smoothing: number = 0.1;

    constructor(x: number = 0, y: number = 0) {
        this.position = new Vector2D(x, y);
        this.targetPosition = new Vector2D(x, y);
    }

    /**
     * Set the camera's target position (usually the player)
     */
    setTarget(x: number, y: number, screenWidth: number, screenHeight: number): void {
        this.targetPosition.x = x - screenWidth / 2;
        this.targetPosition.y = y - screenHeight / 2;
    }

    /**
     * Smoothly move camera towards target
     */
    update(): void {
        this.position.x += (this.targetPosition.x - this.position.x) * this.smoothing;
        this.position.y += (this.targetPosition.y - this.position.y) * this.smoothing;
    }
}


