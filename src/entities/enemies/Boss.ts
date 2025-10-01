import { Enemy, EnemyStats } from '../Enemy.js';
import type { Game } from '../../core/Game.js';

/**
 * Boss - The Butcher
 */
export class Boss extends Enemy {
    private specialAttackTimer: number = 0;
    private specialAttackCooldown: number = 5.0;

    constructor(x: number, y: number) {
        const stats: EnemyStats = {
            maxHp: 500,
            hp: 500,
            damage: 20,
            moveSpeed: 30,
            xpValue: 50,
            attackCooldown: 1.5
        };
        
        super(x, y, 32, stats);
        this.color = '#880000';
    }

    update(deltaTime: number, game: Game): void {
        super.update(deltaTime, game);
        
        this.specialAttackTimer -= deltaTime;
        
        // Special attack: charge at player
        if (this.specialAttackTimer <= 0) {
            this.specialAttack(game);
            this.specialAttackTimer = this.specialAttackCooldown;
        }
    }

    private specialAttack(_game: Game): void {
        // Temporarily boost speed for a charge
        const originalSpeed = this.stats.moveSpeed;
        this.stats.moveSpeed = 150;
        
        setTimeout(() => {
            this.stats.moveSpeed = originalSpeed;
        }, 1000);
    }

    render(ctx: CanvasRenderingContext2D, camera: any): void {
        super.render(ctx, camera);
        
        const screenPos = this.getScreenPosition(camera);
        
        // Draw crown to indicate boss
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.moveTo(screenPos.x, screenPos.y - this.radius - 10);
        ctx.lineTo(screenPos.x - 8, screenPos.y - this.radius - 4);
        ctx.lineTo(screenPos.x, screenPos.y - this.radius - 6);
        ctx.lineTo(screenPos.x + 8, screenPos.y - this.radius - 4);
        ctx.closePath();
        ctx.fill();
    }
}

