import { Enemy } from '../Enemy.js';
/**
 * Walker - Basic slow zombie
 */
export class Walker extends Enemy {
    constructor(x, y) {
        const stats = {
            maxHp: 30,
            hp: 30,
            damage: 10,
            moveSpeed: 40,
            xpValue: 1,
            attackCooldown: 1.0
        };
        super(x, y, 12, stats);
        this.color = '#884444';
    }
}
//# sourceMappingURL=Walker.js.map