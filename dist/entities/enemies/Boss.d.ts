import { Enemy } from '../Enemy.js';
import type { Game } from '../../core/Game.js';
/**
 * Boss - The Butcher
 */
export declare class Boss extends Enemy {
    private specialAttackTimer;
    private specialAttackCooldown;
    constructor(x: number, y: number);
    update(deltaTime: number, game: Game): void;
    private specialAttack;
    render(ctx: CanvasRenderingContext2D, camera: any): void;
}
//# sourceMappingURL=Boss.d.ts.map