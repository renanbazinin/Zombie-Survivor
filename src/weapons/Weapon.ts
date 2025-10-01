import type { Game } from '../core/Game.js';
import type { Player } from '../entities/Player.js';

export interface WeaponStats {
    damage: number;
    fireRate: number; // shots per second
    projectileCount: number;
    pierce: number; // how many enemies a projectile can hit
    range: number;
    projectileSpeed: number;
    spread: number; // angle spread in radians
}

/**
 * Base class for all weapons
 */
export abstract class Weapon {
    public name: string;
    public level: number = 1;
    public stats: WeaponStats;
    protected owner: Player;
    protected fireTimer: number = 0;

    constructor(name: string, owner: Player, stats: WeaponStats) {
        this.name = name;
        this.owner = owner;
        this.stats = stats;
    }

    update(deltaTime: number, game: Game): void {
        this.fireTimer += deltaTime;
        
        const fireInterval = 1 / this.stats.fireRate;
        if (this.fireTimer >= fireInterval) {
            this.fire(game);
            this.fireTimer = 0;
        }
    }

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


