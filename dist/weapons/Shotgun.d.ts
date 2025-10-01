import { Weapon } from './Weapon.js';
import type { Player } from '../entities/Player.js';
import type { Game } from '../core/Game.js';
/**
 * Shotgun - Cone burst, high damage, lower fire rate
 */
export declare class Shotgun extends Weapon {
    constructor(owner: Player);
    protected fire(game: Game): void;
    private findNearestEnemy;
    upgrade(): void;
    getUpgradeDescription(): string;
}
//# sourceMappingURL=Shotgun.d.ts.map