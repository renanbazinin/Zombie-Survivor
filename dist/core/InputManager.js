/**
 * Handles keyboard and mouse input
 */
export class InputManager {
    constructor() {
        this.keys = new Map();
        this.keysPressed = new Map();
        this.setupEventListeners();
    }
    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (!this.keys.get(e.code)) {
                this.keysPressed.set(e.code, true);
            }
            this.keys.set(e.code, true);
            // Prevent scrolling with arrow keys and space
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
        window.addEventListener('keyup', (e) => {
            this.keys.set(e.code, false);
            this.keysPressed.set(e.code, false);
        });
    }
    /**
     * Check if a key is currently held down
     */
    isKeyDown(code) {
        return this.keys.get(code) || false;
    }
    /**
     * Check if a key was just pressed this frame
     */
    isKeyPressed(code) {
        const pressed = this.keysPressed.get(code) || false;
        if (pressed) {
            this.keysPressed.set(code, false);
        }
        return pressed;
    }
    /**
     * Get movement direction from WASD/Arrow keys
     */
    getMovementDirection() {
        const dir = { x: 0, y: 0 };
        if (this.isKeyDown('KeyW') || this.isKeyDown('ArrowUp'))
            dir.y -= 1;
        if (this.isKeyDown('KeyS') || this.isKeyDown('ArrowDown'))
            dir.y += 1;
        if (this.isKeyDown('KeyA') || this.isKeyDown('ArrowLeft'))
            dir.x -= 1;
        if (this.isKeyDown('KeyD') || this.isKeyDown('ArrowRight'))
            dir.x += 1;
        // Normalize diagonal movement
        if (dir.x !== 0 && dir.y !== 0) {
            const length = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
            dir.x /= length;
            dir.y /= length;
        }
        return dir;
    }
}
//# sourceMappingURL=InputManager.js.map