/**
 * Handles keyboard and mouse input
 */
export declare class InputManager {
    private keys;
    private keysPressed;
    constructor();
    private setupEventListeners;
    /**
     * Check if a key is currently held down
     */
    isKeyDown(code: string): boolean;
    /**
     * Check if a key was just pressed this frame
     */
    isKeyPressed(code: string): boolean;
    /**
     * Get movement direction from WASD/Arrow keys
     */
    getMovementDirection(): {
        x: number;
        y: number;
    };
}
//# sourceMappingURL=InputManager.d.ts.map