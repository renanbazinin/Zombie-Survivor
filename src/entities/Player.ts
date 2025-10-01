import { Entity } from '../core/Entity.js';
import { Vector2D } from '../core/Vector2D.js';
import type { Game } from '../core/Game.js';
import type { Weapon } from '../weapons/Weapon.js';

export interface PlayerStats {
    maxHp: number;
    hp: number;
    moveSpeed: number;
    armor: number;
    dashCharges: number;
    dashCooldown: number;
    pickupRange: number;
}

/**
 * Player character
 */
export class Player extends Entity {
    public stats: PlayerStats;
    public weapons: Weapon[] = [];
    public level: number = 1;
    public xp: number = 0;
    public xpToNextLevel: number = 5;
    public kills: number = 0;
    
    private dashTimer: number = 0;
    private dashDuration: number = 0.3;
    private isDashing: boolean = false;
    private dashDirection: Vector2D = new Vector2D();
    private invulnerableTimer: number = 0;
    private damageFlashTimer: number = 0;

    constructor(x: number, y: number) {
        super(x, y, 16);
        
        this.stats = {
            maxHp: 100,
            hp: 100,
            moveSpeed: 120,
            armor: 0,
            dashCharges: 2,
            dashCooldown: 1.6,
            pickupRange: 50
        };
    }

    update(deltaTime: number, game: Game): void {
        // Update timers
        if (this.dashTimer > 0) this.dashTimer -= deltaTime;
        if (this.invulnerableTimer > 0) this.invulnerableTimer -= deltaTime;
        if (this.damageFlashTimer > 0) this.damageFlashTimer -= deltaTime;

        // Handle dash
        if (game.input.isKeyPressed('Space') && this.dashTimer <= 0) {
            this.startDash(game);
        }

        if (this.isDashing) {
            this.updateDash(deltaTime);
        } else {
            this.updateMovement(deltaTime, game);
        }

        // Update weapons
        for (const weapon of this.weapons) {
            weapon.update(deltaTime, game);
        }

        // Collect pickups in range
        this.collectPickups(game);
    }

    private updateMovement(deltaTime: number, game: Game): void {
        const dir = game.input.getMovementDirection();
        
        this.velocity.x = dir.x * this.stats.moveSpeed;
        this.velocity.y = dir.y * this.stats.moveSpeed;
        
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
    }

    private startDash(game: Game): void {
        const dir = game.input.getMovementDirection();
        
        if (dir.x === 0 && dir.y === 0) return;
        
        this.isDashing = true;
        this.dashTimer = this.stats.dashCooldown;
        this.invulnerableTimer = this.dashDuration;
        this.dashDirection.set(dir.x, dir.y);
    }

    private updateDash(deltaTime: number): void {
        const dashSpeed = 400;
        this.position.x += this.dashDirection.x * dashSpeed * deltaTime;
        this.position.y += this.dashDirection.y * dashSpeed * deltaTime;

        if (this.invulnerableTimer <= 0) {
            this.isDashing = false;
        }
    }

    private collectPickups(game: Game): void {
        const pickupRangeSquared = this.stats.pickupRange * this.stats.pickupRange;
        
        for (let i = game.pickups.length - 1; i >= 0; i--) {
            const pickup = game.pickups[i];
            const distSquared = this.position.distanceSquaredTo(pickup.position);
            
            if (distSquared < pickupRangeSquared) {
                pickup.collect(this, game);
                game.pickups.splice(i, 1);
            }
        }
    }

    render(ctx: CanvasRenderingContext2D, camera: Vector2D): void {
        const screenPos = this.getScreenPosition(camera);
        
        // Flash white when damaged
        if (this.damageFlashTimer > 0) {
            ctx.fillStyle = '#ffffff';
        } else if (this.isDashing) {
            ctx.fillStyle = '#00ffff';
        } else {
            ctx.fillStyle = '#00ff00';
        }
        
        // Draw player as a triangle pointing up
        ctx.save();
        ctx.translate(screenPos.x, screenPos.y);
        
        ctx.beginPath();
        ctx.moveTo(0, -this.radius);
        ctx.lineTo(-this.radius * 0.7, this.radius * 0.7);
        ctx.lineTo(this.radius * 0.7, this.radius * 0.7);
        ctx.closePath();
        ctx.fill();
        
        // Draw outline
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
    }

    takeDamage(amount: number): void {
        if (this.invulnerableTimer > 0) return;
        
        // Apply armor reduction
        const actualDamage = Math.max(1, amount - this.stats.armor);
        this.stats.hp -= actualDamage;
        this.damageFlashTimer = 0.1;
        
        if (this.stats.hp <= 0) {
            this.stats.hp = 0;
            this.kill();
        }
    }

    heal(amount: number): void {
        this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + amount);
    }

    addXP(amount: number, game: Game): void {
        this.xp += amount;
        
        while (this.xp >= this.xpToNextLevel) {
            this.xp -= this.xpToNextLevel;
            this.levelUp(game);
        }
    }

    private levelUp(game: Game): void {
        this.level++;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.2);
        
        // Trigger level-up UI
        game.ui.showLevelUpModal(game);
    }

    addWeapon(weapon: Weapon): void {
        this.weapons.push(weapon);
    }

    getHpPercent(): number {
        return this.stats.hp / this.stats.maxHp;
    }

    getXpPercent(): number {
        return this.xp / this.xpToNextLevel;
    }
}


