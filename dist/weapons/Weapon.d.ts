import type { Game } from '../core/Game.js';
import type { Player } from '../entities/Player.js';
export interface WeaponStats {
    damage: number;
    fireRate: number;
    projectileCount: number;
    pierce: number;
    range: number;
    projectileSpeed: number;
    spread: number;
}
/**
 * Base class for all weapons
 */
export declare abstract class Weapon {
    name: string;
    level: number;
    stats: WeaponStats;
    protected owner: Player;
    protected fireTimer: number;
    constructor(name: string, owner: Player, stats: WeaponStats);
    update(deltaTime: number, game: Game): void;
    /**
     * Fire the weapon - implemented by subclasses
     */
    protected abstract fire(game: Game): void;
    /**
     * Upgrade this weapon to the next level
     */
    abstract upgrade(): void;
    /**
     * Get the description for the next level upgrade
     */
    abstract getUpgradeDescription(): string;
}
//# sourceMappingURL=Weapon.d.ts.map