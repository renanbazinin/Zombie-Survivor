import { Vector2D } from './Vector2D.js';
/**
 * Camera that follows the player
 */
export declare class Camera {
    position: Vector2D;
    private targetPosition;
    private smoothing;
    constructor(x?: number, y?: number);
    /**
     * Set the camera's target position (usually the player)
     */
    setTarget(x: number, y: number, screenWidth: number, screenHeight: number): void;
    /**
     * Smoothly move camera towards target
     */
    update(): void;
}
//# sourceMappingURL=Camera.d.ts.map