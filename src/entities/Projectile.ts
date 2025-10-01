import { Entity } from '../core/Entity.js';
import { Vector2D } from '../core/Vector2D.js';
import type { Game } from '../core/Game.js';

/**
 * Projectile fired by weapons
 */
export class Projectile extends Entity {
    private direction: Vector2D;
    private speed: number;
    private damage: number;
    private maxRange: number;
    private distanceTraveled: number = 0;
    private pierce: number;
    private hitEnemies: Set<number> = new Set();
    private color: string;

    constructor(
        x: number,
        y: number,
        angle: number,
        speed: number,
        damage: number,
        maxRange: number,
        pierce: number,
        color: string
    ) {
        super(x, y, 4);
        this.direction = Vector2D.fromAngle(angle);
        this.speed = speed;
        this.damage = damage;
        this.maxRange = maxRange;
        this.pierce = pierce;
        this.color = color;
    }

    update(deltaTime: number, game: Game): void {
        // Move projectile
        const movement = this.direction.clone().multiply(this.speed * deltaTime);
        this.position.add(movement);
        this.distanceTraveled += movement.length();

        // Check if exceeded max range
        if (this.distanceTraveled > this.maxRange) {
            this.kill();
            return;
        }

        // Check collision with enemies
        for (let i = 0; i < game.enemies.length; i++) {
            const enemy = game.enemies[i];
            
            // Skip if already hit this enemy
            if (this.hitEnemies.has(i)) continue;
            
            if (this.collidesWith(enemy)) {
                enemy.takeDamage(this.damage, game);
                this.hitEnemies.add(i);
                
                // Check if projectile should die
                if (this.hitEnemies.size > this.pierce) {
                    this.kill();
                    return;
                }
            }
        }
    }

    render(ctx: CanvasRenderingContext2D, camera: Vector2D): void {
        const screenPos = this.getScreenPosition(camera);
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Small glow effect
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}


