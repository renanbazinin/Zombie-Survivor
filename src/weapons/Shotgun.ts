import { Weapon, WeaponStats } from './Weapon.js';
import type { Player } from '../entities/Player.js';
import type { Game } from '../core/Game.js';
import { Projectile } from '../entities/Projectile.js';

/**
 * Shotgun - Cone burst, high damage, lower fire rate
 */
export class Shotgun extends Weapon {
    constructor(owner: Player) {
        const stats: WeaponStats = {
            damage: 15,
            fireRate: 2, // 2 shots per second
            projectileCount: 5,
            pierce: 0,
            range: 250,
            projectileSpeed: 600,
            spread: 0.6
        };
        
        super('Shotgun', owner, stats);
    }

    protected fire(game: Game): void {
        if (game.enemies.length === 0) return;
        
        // Find nearest enemy for aiming
        const target = this.findNearestEnemy(game);
        if (!target) return;
        
        const angleToTarget = Math.atan2(
            target.position.y - this.owner.position.y,
            target.position.x - this.owner.position.x
        );
        
        // Fire pellets in a cone
        for (let i = 0; i < this.stats.projectileCount; i++) {
            const spreadPercent = (i / (this.stats.projectileCount - 1)) - 0.5;
            const angle = angleToTarget + spreadPercent * this.stats.spread;
            
            const projectile = new Projectile(
                this.owner.position.x,
                this.owner.position.y,
                angle,
                this.stats.projectileSpeed,
                this.stats.damage,
                this.stats.range,
                this.stats.pierce,
                '#ff8800'
            );
            
            game.projectiles.push(projectile);
        }
    }

    private findNearestEnemy(game: Game): any {
        let nearest = null;
        let minDist = Infinity;
        
        for (const enemy of game.enemies) {
            const dist = this.owner.position.distanceSquaredTo(enemy.position);
            if (dist < minDist) {
                minDist = dist;
                nearest = enemy;
            }
        }
        
        return nearest;
    }

    upgrade(): void {
        this.level++;
        
        switch (this.level) {
            case 2:
                this.stats.damage += 5;
                this.stats.projectileCount += 2;
                break;
            case 3:
                this.stats.fireRate += 0.5;
                this.stats.damage += 5;
                break;
            case 4:
                this.stats.pierce += 1;
                this.stats.projectileCount += 2;
                break;
            case 5:
                this.stats.damage += 10;
                this.stats.range += 100;
                break;
        }
    }

    getUpgradeDescription(): string {
        switch (this.level) {
            case 1: return '+5 damage, +2 pellets';
            case 2: return '+0.5 fire rate, +5 damage';
            case 3: return '+1 pierce, +2 pellets';
            case 4: return '+10 damage, +100 range';
            case 5: return 'MAX LEVEL';
            default: return 'MAX LEVEL';
        }
    }
}


