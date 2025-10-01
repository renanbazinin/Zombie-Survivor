import { Entity } from '../core/Entity.js';
import { Vector2D } from '../core/Vector2D.js';
import type { Game } from '../core/Game.js';
import type { Weapon } from '../weapons/Weapon.js';
export interface PlayerStats {
    maxHp: number;
    hp: number;
    moveSpeed: number;
    armor: number;
    dashCharges: number;
    dashCooldown: number;
    pickupRange: number;
}
/**
 * Player character
 */
export declare class Player extends Entity {
    stats: PlayerStats;
    weapons: Weapon[];
    level: number;
    xp: number;
    xpToNextLevel: number;
    kills: number;
    private dashTimer;
    private dashDuration;
    private isDashing;
    private dashDirection;
    private invulnerableTimer;
    private damageFlashTimer;
    constructor(x: number, y: number);
    update(deltaTime: number, game: Game): void;
    private updateMovement;
    private startDash;
    private updateDash;
    private collectPickups;
    render(ctx: CanvasRenderingContext2D, camera: Vector2D): void;
    takeDamage(amount: number): void;
    heal(amount: number): void;
    addXP(amount: number, game: Game): void;
    private levelUp;
    addWeapon(weapon: Weapon): void;
    getHpPercent(): number;
    getXpPercent(): number;
}
//# sourceMappingURL=Player.d.ts.map