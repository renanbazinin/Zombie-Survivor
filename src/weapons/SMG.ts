import { Weapon, WeaponStats } from './Weapon.js';
import type { Player } from '../entities/Player.js';
import type { Game } from '../core/Game.js';
import { Projectile } from '../entities/Projectile.js';

/**
 * SMG - High fire rate, low damage
 */
export class SMG extends Weapon {
    constructor(owner: Player) {
        const stats: WeaponStats = {
            damage: 8,
            fireRate: 5, // 5 shots per second
            projectileCount: 1,
            pierce: 0,
            range: 400,
            projectileSpeed: 500,
            spread: 0.1
        };
        
        super('SMG', owner, stats);
    }

    protected fire(game: Game): void {
        if (game.enemies.length === 0) return;
        
        // Find nearest enemy
        const target = this.findNearestEnemy(game);
        if (!target) return;
        
        const angleToTarget = Math.atan2(
            target.position.y - this.owner.position.y,
            target.position.x - this.owner.position.x
        );
        
        for (let i = 0; i < this.stats.projectileCount; i++) {
            const spread = (Math.random() - 0.5) * this.stats.spread;
            const angle = angleToTarget + spread;
            
            const projectile = new Projectile(
                this.owner.position.x,
                this.owner.position.y,
                angle,
                this.stats.projectileSpeed,
                this.stats.damage,
                this.stats.range,
                this.stats.pierce,
                '#ffff00'
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
                this.stats.damage += 2;
                this.stats.fireRate += 1;
                break;
            case 3:
                this.stats.projectileCount += 1;
                this.stats.spread *= 1.5;
                break;
            case 4:
                this.stats.pierce += 1;
                this.stats.damage += 3;
                break;
            case 5:
                this.stats.fireRate += 2;
                this.stats.projectileCount += 1;
                break;
        }
    }

    getUpgradeDescription(): string {
        switch (this.level) {
            case 1: return '+2 damage, +1 fire rate';
            case 2: return '+1 projectile';
            case 3: return '+1 pierce, +3 damage';
            case 4: return '+2 fire rate, +1 projectile';
            case 5: return 'MAX LEVEL';
            default: return 'MAX LEVEL';
        }
    }
}

