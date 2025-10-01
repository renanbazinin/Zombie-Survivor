import { Weapon } from './Weapon.js';
import type { Player } from '../entities/Player.js';
import type { Game } from '../core/Game.js';
/**
 * SMG - High fire rate, low damage
 */
export declare class SMG extends Weapon {
    constructor(owner: Player);
    protected fire(game: Game): void;
    private findNearestEnemy;
    upgrade(): void;
    getUpgradeDescription(): string;
}
//# sourceMappingURL=SMG.d.ts.map