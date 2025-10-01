import { Entity } from '../core/Entity.js';
import { Vector2D } from '../core/Vector2D.js';
import type { Game } from '../core/Game.js';
import { Pickup } from './Pickup.js';

export interface EnemyStats {
    maxHp: number;
    hp: number;
    damage: number;
    moveSpeed: number;
    xpValue: number;
    attackCooldown: number;
}

/**
 * Base class for all enemies
 */
export abstract class Enemy extends Entity {
    public stats: EnemyStats;
    protected attackTimer: number = 0;
    protected damageFlashTimer: number = 0;
    protected color: string = '#ff0000';

    constructor(x: number, y: number, radius: number, stats: EnemyStats) {
        super(x, y, radius);
        this.stats = stats;
    }

    update(deltaTime: number, game: Game): void {
        // Update timers
        if (this.attackTimer > 0) this.attackTimer -= deltaTime;
        if (this.damageFlashTimer > 0) this.damageFlashTimer -= deltaTime;

        // Move towards player
        const direction = new Vector2D(
            game.player.position.x - this.position.x,
            game.player.position.y - this.position.y
        ).normalize();

        this.velocity = direction.multiply(this.stats.moveSpeed);
        this.position.add(new Vector2D(this.velocity.x * deltaTime, this.velocity.y * deltaTime));

        // Check collision with player
        if (this.collidesWith(game.player) && this.attackTimer <= 0) {
            this.attackPlayer(game.player);
            this.attackTimer = this.stats.attackCooldown;
        }
    }

    protected attackPlayer(player: any): void {
        player.takeDamage(this.stats.damage);
    }

    takeDamage(amount: number, game: Game): void {
        this.stats.hp -= amount;
        this.damageFlashTimer = 0.1;

        if (this.stats.hp <= 0) {
            this.die(game);
        }
    }

    protected die(game: Game): void {
        this.kill();
        game.player.kills++;
        
        // Drop XP
        this.dropXP(game);
    }

    protected dropXP(game: Game): void {
        const pickup = new Pickup(
            this.position.x,
            this.position.y,
            'xp',
            this.stats.xpValue
        );
        game.pickups.push(pickup);
    }

    render(ctx: CanvasRenderingContext2D, camera: Vector2D): void {
        const screenPos = this.getScreenPosition(camera);
        
        // Flash white when damaged
        if (this.damageFlashTimer > 0) {
            ctx.fillStyle = '#ffffff';
        } else {
            ctx.fillStyle = this.color;
        }
        
        // Draw as circle
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw HP bar
        if (this.stats.hp < this.stats.maxHp) {
            const barWidth = this.radius * 2;
            const barHeight = 4;
            const hpPercent = this.stats.hp / this.stats.maxHp;
            
            ctx.fillStyle = '#000000';
            ctx.fillRect(screenPos.x - barWidth/2, screenPos.y - this.radius - 8, barWidth, barHeight);
            
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(screenPos.x - barWidth/2, screenPos.y - this.radius - 8, barWidth * hpPercent, barHeight);
        }
    }
}


