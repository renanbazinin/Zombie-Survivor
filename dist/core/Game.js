import { Player } from '../entities/Player.js';
import { InputManager } from './InputManager.js';
import { Camera } from './Camera.js';
import { WaveManager } from '../systems/WaveManager.js';
import { UIManager } from '../systems/UIManager.js';
import { SMG } from '../weapons/SMG.js';
/**
 * Main game class that manages all systems
 */
export class Game {
    constructor(canvas) {
        this.enemies = [];
        this.projectiles = [];
        this.pickups = [];
        this.paused = false;
        this.gameOver = false;
        this.lastTime = 0;
        /**
         * Main game loop
         */
        this.gameLoop = () => {
            const currentTime = performance.now();
            const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1); // Cap at 100ms
            this.lastTime = currentTime;
            if (!this.paused && !this.gameOver) {
                this.update(deltaTime);
            }
            this.render();
            requestAnimationFrame(this.gameLoop);
        };
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get 2D context');
        }
        this.ctx = ctx;
        // Initialize systems
        this.input = new InputManager();
        this.camera = new Camera();
        this.waveManager = new WaveManager();
        this.ui = new UIManager();
        // Create player at center
        this.player = new Player(640, 360);
        // Give player starting weapon (SMG for Ranger)
        const smg = new SMG(this.player);
        this.player.addWeapon(smg);
    }
    /**
     * Start the game loop
     */
    start() {
        this.lastTime = performance.now();
        this.gameLoop();
    }
    /**
     * Update all game systems
     */
    update(deltaTime) {
        // Update player
        this.player.update(deltaTime, this);
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(deltaTime, this);
            if (enemy.isDead) {
                this.enemies.splice(i, 1);
            }
        }
        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update(deltaTime, this);
            if (projectile.isDead) {
                this.projectiles.splice(i, 1);
            }
        }
        // Update pickups
        for (let i = this.pickups.length - 1; i >= 0; i--) {
            const pickup = this.pickups[i];
            pickup.update(deltaTime, this);
            if (pickup.isDead) {
                this.pickups.splice(i, 1);
            }
        }
        // Update wave manager
        this.waveManager.update(deltaTime, this);
        // Update camera
        this.camera.setTarget(this.player.position.x, this.player.position.y, this.canvas.width, this.canvas.height);
        this.camera.update();
        // Update UI
        this.ui.update(this);
        // Check game over conditions
        if (this.player.isDead) {
            this.triggerGameOver(false);
        }
        // Check victory condition (survive 7 minutes)
        if (this.waveManager.getGameTime() >= 420) {
            this.triggerGameOver(true);
        }
    }
    /**
     * Render the game
     */
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw background grid
        this.drawBackground();
        // Draw pickups
        for (const pickup of this.pickups) {
            pickup.render(this.ctx, this.camera.position);
        }
        // Draw enemies
        for (const enemy of this.enemies) {
            enemy.render(this.ctx, this.camera.position);
        }
        // Draw projectiles
        for (const projectile of this.projectiles) {
            projectile.render(this.ctx, this.camera.position);
        }
        // Draw player
        this.player.render(this.ctx, this.camera.position);
        // Draw debug info
        this.drawDebugInfo();
    }
    drawBackground() {
        const tileSize = 64;
        const gridColor = '#2a2a2a';
        this.ctx.strokeStyle = gridColor;
        this.ctx.lineWidth = 1;
        // Calculate visible tiles
        const startX = Math.floor(this.camera.position.x / tileSize) * tileSize;
        const startY = Math.floor(this.camera.position.y / tileSize) * tileSize;
        const endX = startX + this.canvas.width + tileSize;
        const endY = startY + this.canvas.height + tileSize;
        // Draw vertical lines
        for (let x = startX; x <= endX; x += tileSize) {
            const screenX = x - this.camera.position.x;
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, 0);
            this.ctx.lineTo(screenX, this.canvas.height);
            this.ctx.stroke();
        }
        // Draw horizontal lines
        for (let y = startY; y <= endY; y += tileSize) {
            const screenY = y - this.camera.position.y;
            this.ctx.beginPath();
            this.ctx.moveTo(0, screenY);
            this.ctx.lineTo(this.canvas.width, screenY);
            this.ctx.stroke();
        }
    }
    drawDebugInfo() {
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`Enemies: ${this.enemies.length}`, 10, this.canvas.height - 60);
        this.ctx.fillText(`Projectiles: ${this.projectiles.length}`, 10, this.canvas.height - 45);
        this.ctx.fillText(`Pickups: ${this.pickups.length}`, 10, this.canvas.height - 30);
        this.ctx.fillText(`FPS: ${Math.round(1 / (performance.now() - this.lastTime) * 1000)}`, 10, this.canvas.height - 15);
    }
    triggerGameOver(victory) {
        if (this.gameOver)
            return;
        this.gameOver = true;
        this.ui.showGameOver(this, victory);
    }
}
//# sourceMappingURL=Game.js.map