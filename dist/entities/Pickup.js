import { Entity } from '../core/Entity.js';
/**
 * Pickups that the player can collect
 */
export class Pickup extends Entity {
    constructor(x, y, type, value) {
        super(x, y, 8);
        this.lifetime = 30; // despawn after 30 seconds
        this.bobOffset = 0;
        this.bobSpeed = 3;
        this.type = type;
        this.value = value;
        this.bobOffset = Math.random() * Math.PI * 2;
    }
    update(deltaTime, _game) {
        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            this.kill();
        }
        this.bobOffset += this.bobSpeed * deltaTime;
    }
    collect(player, game) {
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
    render(ctx, camera) {
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
        }
        else if (shape === 'cross') {
            const size = this.radius * 0.6;
            ctx.fillRect(-size / 2, -this.radius, size, this.radius * 2);
            ctx.fillRect(-this.radius, -size / 2, this.radius * 2, size);
        }
        else {
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
//# sourceMappingURL=Pickup.js.map