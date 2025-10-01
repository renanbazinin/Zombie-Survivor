import { Entity } from '../core/Entity.js';
import { Vector2D } from '../core/Vector2D.js';
/**
 * Player character
 */
export class Player extends Entity {
    constructor(x, y) {
        super(x, y, 16);
        this.weapons = [];
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 5;
        this.kills = 0;
        this.dashTimer = 0;
        this.dashDuration = 0.3;
        this.isDashing = false;
        this.dashDirection = new Vector2D();
        this.invulnerableTimer = 0;
        this.damageFlashTimer = 0;
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
    update(deltaTime, game) {
        // Update timers
        if (this.dashTimer > 0)
            this.dashTimer -= deltaTime;
        if (this.invulnerableTimer > 0)
            this.invulnerableTimer -= deltaTime;
        if (this.damageFlashTimer > 0)
            this.damageFlashTimer -= deltaTime;
        // Handle dash
        if (game.input.isKeyPressed('Space') && this.dashTimer <= 0) {
            this.startDash(game);
        }
        if (this.isDashing) {
            this.updateDash(deltaTime);
        }
        else {
            this.updateMovement(deltaTime, game);
        }
        // Update weapons
        for (const weapon of this.weapons) {
            weapon.update(deltaTime, game);
        }
        // Collect pickups in range
        this.collectPickups(game);
    }
    updateMovement(deltaTime, game) {
        const dir = game.input.getMovementDirection();
        this.velocity.x = dir.x * this.stats.moveSpeed;
        this.velocity.y = dir.y * this.stats.moveSpeed;
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
    }
    startDash(game) {
        const dir = game.input.getMovementDirection();
        if (dir.x === 0 && dir.y === 0)
            return;
        this.isDashing = true;
        this.dashTimer = this.stats.dashCooldown;
        this.invulnerableTimer = this.dashDuration;
        this.dashDirection.set(dir.x, dir.y);
    }
    updateDash(deltaTime) {
        const dashSpeed = 400;
        this.position.x += this.dashDirection.x * dashSpeed * deltaTime;
        this.position.y += this.dashDirection.y * dashSpeed * deltaTime;
        if (this.invulnerableTimer <= 0) {
            this.isDashing = false;
        }
    }
    collectPickups(game) {
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
    render(ctx, camera) {
        const screenPos = this.getScreenPosition(camera);
        // Flash white when damaged
        if (this.damageFlashTimer > 0) {
            ctx.fillStyle = '#ffffff';
        }
        else if (this.isDashing) {
            ctx.fillStyle = '#00ffff';
        }
        else {
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
    takeDamage(amount) {
        if (this.invulnerableTimer > 0)
            return;
        // Apply armor reduction
        const actualDamage = Math.max(1, amount - this.stats.armor);
        this.stats.hp -= actualDamage;
        this.damageFlashTimer = 0.1;
        if (this.stats.hp <= 0) {
            this.stats.hp = 0;
            this.kill();
        }
    }
    heal(amount) {
        this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + amount);
    }
    addXP(amount, game) {
        this.xp += amount;
        while (this.xp >= this.xpToNextLevel) {
            this.xp -= this.xpToNextLevel;
            this.levelUp(game);
        }
    }
    levelUp(game) {
        this.level++;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.2);
        // Trigger level-up UI
        game.ui.showLevelUpModal(game);
    }
    addWeapon(weapon) {
        this.weapons.push(weapon);
    }
    getHpPercent() {
        return this.stats.hp / this.stats.maxHp;
    }
    getXpPercent() {
        return this.xp / this.xpToNextLevel;
    }
}
//# sourceMappingURL=Player.js.map