import { Enemy } from '../Enemy.js';
/**
 * Boss - The Butcher
 */
export class Boss extends Enemy {
    constructor(x, y) {
        const stats = {
            maxHp: 500,
            hp: 500,
            damage: 20,
            moveSpeed: 30,
            xpValue: 50,
            attackCooldown: 1.5
        };
        super(x, y, 32, stats);
        this.specialAttackTimer = 0;
        this.specialAttackCooldown = 5.0;
        this.color = '#880000';
    }
    update(deltaTime, game) {
        super.update(deltaTime, game);
        this.specialAttackTimer -= deltaTime;
        // Special attack: charge at player
        if (this.specialAttackTimer <= 0) {
            this.specialAttack(game);
            this.specialAttackTimer = this.specialAttackCooldown;
        }
    }
    specialAttack(_game) {
        // Temporarily boost speed for a charge
        const originalSpeed = this.stats.moveSpeed;
        this.stats.moveSpeed = 150;
        setTimeout(() => {
            this.stats.moveSpeed = originalSpeed;
        }, 1000);
    }
    render(ctx, camera) {
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
//# sourceMappingURL=Boss.js.map