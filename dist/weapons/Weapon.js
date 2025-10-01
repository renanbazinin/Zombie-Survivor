/**
 * Base class for all weapons
 */
export class Weapon {
    constructor(name, owner, stats) {
        this.level = 1;
        this.fireTimer = 0;
        this.name = name;
        this.owner = owner;
        this.stats = stats;
    }
    update(deltaTime, game) {
        this.fireTimer += deltaTime;
        const fireInterval = 1 / this.stats.fireRate;
        if (this.fireTimer >= fireInterval) {
            this.fire(game);
            this.fireTimer = 0;
        }
    }
}
//# sourceMappingURL=Weapon.js.map