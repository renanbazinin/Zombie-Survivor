import { Entity } from '../core/Entity.js';
import { Vector2D } from '../core/Vector2D.js';
import type { Game } from '../core/Game.js';
import type { Player } from './Player.js';
export type PickupType = 'xp' | 'health' | 'coin';
/**
 * Pickups that the player can collect
 */
export declare class Pickup extends Entity {
    private type;
    private value;
    private lifetime;
    private bobOffset;
    private bobSpeed;
    constructor(x: number, y: number, type: PickupType, value: number);
    update(deltaTime: number, _game: Game): void;
    collect(player: Player, game: Game): void;
    render(ctx: CanvasRenderingContext2D, camera: Vector2D): void;
}
//# sourceMappingURL=Pickup.d.ts.map