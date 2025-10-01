import { Entity } from '../core/Entity.js';
import { Vector2D } from '../core/Vector2D.js';
import type { Game } from '../core/Game.js';
import type { Player } from './Player.js';

export type PickupType = 'xp' | 'health' | 'coin';

/**
 * Pickups that the player can collect
 */
export class Pickup extends Entity {
    private type: PickupType;
    private value: number;
    private lifetime: number = 30; // despawn after 30 seconds
    private bobOffset: number = 0;
    private bobSpeed: number = 3;

    constructor(x: number, y: number, type: PickupType, value: number) {
        super(x, y, 8);
        this.type = type;
        this.value = value;
        this.bobOffset = Math.random() * Math.PI * 2;
    }

    update(deltaTime: number, _game: Game): void {
        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            this.kill();
        }
        
        this.bobOffset += this.bobSpeed * deltaTime;
    }

    collect(player: Player, game: Game): void {
        switch (this.type) {
            case 'xp':
                player.addXP(this.value, game);
                break;
            case 'health':
                player.heal(this.value);
                break;
            case 'coin':
                // TODO: Add coin collection
                break;
        }
    }

    render(ctx: CanvasRenderingContext2D, camera: Vector2D): void {
        const screenPos = this.getScreenPosition(camera);
        const bob = Math.sin(this.bobOffset) * 3;
        
        let color = '#00ff00';
        let shape = 'circle';
        
        switch (this.type) {
            case 'xp':
                color = '#00ff00';
                shape = 'diamond';
                break;
            case 'health':
                color = '#ff0000';
                shape = 'cross';
                break;
            case 'coin':
                color = '#ffff00';
                shape = 'circle';
                break;
        }
        
        ctx.save();
        ctx.translate(screenPos.x, screenPos.y + bob);
        
        ctx.fillStyle = color;
        
        if (shape === 'diamond') {
            ctx.beginPath();
            ctx.moveTo(0, -this.radius);
            ctx.lineTo(this.radius, 0);
            ctx.lineTo(0, this.radius);
            ctx.lineTo(-this.radius, 0);
            ctx.closePath();
            ctx.fill();
        } else if (shape === 'cross') {
            const size = this.radius * 0.6;
            ctx.fillRect(-size/2, -this.radius, size, this.radius * 2);
            ctx.fillRect(-this.radius, -size/2, this.radius * 2, size);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Glow effect
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        
        ctx.restore();
    }
}

