import { Enemy } from '../Enemy.js';
/**
 * Runner - Fast, low HP zombie
 */
export class Runner extends Enemy {
    constructor(x, y) {
        const stats = {
            maxHp: 15,
            hp: 15,
            damage: 8,
            moveSpeed: 100,
            xpValue: 2,
            attackCooldown: 0.8
        };
        super(x, y, 10, stats);
        this.color = '#ff4444';
    }
}
//# sourceMappingURL=Runner.js.map