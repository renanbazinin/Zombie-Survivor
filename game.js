// Zombie Survivor Game - Single File Version
// All classes and game logic in one file for easy client-side execution

// Image loading system
class ImageLoader {
    constructor() {
        this.images = new Map();
        this.loadingPromises = [];
    }

    loadImage(name, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images.set(name, img);
                resolve(img);
            };
            img.onerror = reject;
            img.src = src;
        });
    }

    getImage(name) {
        return this.images.get(name);
    }

    async loadAllImages() {
        const imagePromises = [
            this.loadImage('playerDown', 'src/images/playerdown.png'),
            this.loadImage('zombieWalkingDown01', 'src/images/walkingDownFrame01.png'),
            this.loadImage('zombieWalkingDown02', 'src/images/walkingDownFrame02.png'),
            this.loadImage('zombieWalkingRight01', 'src/images/walkingRightFrame01.png'),
            this.loadImage('zombieWalkingRight02', 'src/images/walkingRightFrame02.png')
        ];

        await Promise.all(imagePromises);
        console.log('All images loaded successfully');
    }
}

// Global image loader
const imageLoader = new ImageLoader();

class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Vector2D(this.x, this.y);
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }

    normalize() {
        const len = this.length();
        if (len > 0) {
            this.x /= len;
            this.y /= len;
        }
        return this;
    }

    distanceTo(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    distanceSquaredTo(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return dx * dx + dy * dy;
    }

    angle() {
        return Math.atan2(this.y, this.x);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    static fromAngle(angle, length = 1) {
        return new Vector2D(Math.cos(angle) * length, Math.sin(angle) * length);
    }

    static zero() {
        return new Vector2D(0, 0);
    }
}

class InputManager {
    constructor() {
        this.keys = new Map();
        this.keysPressed = new Map();
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (!this.keys.get(e.code)) {
                this.keysPressed.set(e.code, true);
            }
            this.keys.set(e.code, true);
            
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys.set(e.code, false);
            this.keysPressed.set(e.code, false);
        });
    }

    isKeyDown(code) {
        return this.keys.get(code) || false;
    }

    isKeyPressed(code) {
        const pressed = this.keysPressed.get(code) || false;
        if (pressed) {
            this.keysPressed.set(code, false);
        }
        return pressed;
    }

    getMovementDirection() {
        const dir = { x: 0, y: 0 };

        if (this.isKeyDown('KeyW') || this.isKeyDown('ArrowUp')) dir.y -= 1;
        if (this.isKeyDown('KeyS') || this.isKeyDown('ArrowDown')) dir.y += 1;
        if (this.isKeyDown('KeyA') || this.isKeyDown('ArrowLeft')) dir.x -= 1;
        if (this.isKeyDown('KeyD') || this.isKeyDown('ArrowRight')) dir.x += 1;

        if (dir.x !== 0 && dir.y !== 0) {
            const length = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
            dir.x /= length;
            dir.y /= length;
        }

        return dir;
    }
}

class Camera {
    constructor(x = 0, y = 0) {
        this.position = new Vector2D(x, y);
        this.targetPosition = new Vector2D(x, y);
        this.smoothing = 0.1;
    }

    setTarget(x, y, screenWidth, screenHeight) {
        this.targetPosition.x = x - screenWidth / 2;
        this.targetPosition.y = y - screenHeight / 2;
    }

    update() {
        this.position.x += (this.targetPosition.x - this.position.x) * this.smoothing;
        this.position.y += (this.targetPosition.y - this.position.y) * this.smoothing;
    }
}

class Entity {
    constructor(x, y, radius) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
        this.radius = radius;
        this.isDead = false;
    }

    kill() {
        this.isDead = true;
    }

    collidesWith(other) {
        const distance = this.position.distanceSquaredTo(other.position);
        const radiusSum = this.radius + other.radius;
        return distance < radiusSum * radiusSum;
    }

    getScreenPosition(camera) {
        return new Vector2D(
            this.position.x - camera.x,
            this.position.y - camera.y
        );
    }
}

class Player extends Entity {
    constructor(x, y) {
        super(x, y, 16);
        
        this.stats = {
            maxHp: 100,
            hp: 100,
            moveSpeed: 120,
            armor: 0,
            dashCharges: 2,
            dashCooldown: 1.6,
            pickupRange: 50
        };
        
        this.weapons = [];
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 5;
        this.kills = 0;
        
        this.dashTimer = 0;
        this.dashDuration = 0.3;
        this.isDashing = false;
        this.dashDirection = new Vector2D();
        this.invulnerableTimer = 0;
        this.damageFlashTimer = 0;
        
        // Animation properties
        this.animationTimer = 0;
        this.animationSpeed = 0.2; // seconds per frame
        this.currentFrame = 0;
        this.facingDirection = 'down'; // down, up, left, right
        this.isMoving = false;
    }

    update(deltaTime, game) {
        if (this.dashTimer > 0) this.dashTimer -= deltaTime;
        if (this.invulnerableTimer > 0) this.invulnerableTimer -= deltaTime;
        if (this.damageFlashTimer > 0) this.damageFlashTimer -= deltaTime;

        if (game.input.isKeyPressed('Space') && this.dashTimer <= 0) {
            this.startDash(game);
        }

        if (this.isDashing) {
            this.updateDash(deltaTime);
        } else {
            this.updateMovement(deltaTime, game);
        }

        // Update animation
        this.updateAnimation(deltaTime);

        for (const weapon of this.weapons) {
            weapon.update(deltaTime, game);
        }

        this.collectPickups(game);
    }

    updateMovement(deltaTime, game) {
        const dir = game.input.getMovementDirection();
        
        // Update facing direction based on movement
        if (dir.x !== 0 || dir.y !== 0) {
            this.isMoving = true;
            if (Math.abs(dir.x) > Math.abs(dir.y)) {
                this.facingDirection = dir.x > 0 ? 'right' : 'left';
            } else {
                this.facingDirection = dir.y > 0 ? 'down' : 'up';
            }
        } else {
            this.isMoving = false;
        }
        
        this.velocity.x = dir.x * this.stats.moveSpeed;
        this.velocity.y = dir.y * this.stats.moveSpeed;
        
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
    }

    updateAnimation(deltaTime) {
        if (this.isMoving) {
            this.animationTimer += deltaTime;
            if (this.animationTimer >= this.animationSpeed) {
                this.animationTimer = 0;
                this.currentFrame = (this.currentFrame + 1) % 2; // Switch between 0 and 1
            }
        } else {
            this.currentFrame = 0; // Reset to first frame when not moving
            this.animationTimer = 0;
        }
    }

    startDash(game) {
        const dir = game.input.getMovementDirection();
        
        if (dir.x === 0 && dir.y === 0) return;
        
        this.isDashing = true;
        this.dashTimer = this.stats.dashCooldown;
        this.invulnerableTimer = this.dashDuration;
        this.dashDirection.set(dir.x, dir.y);
    }

    updateDash(deltaTime) {
        const dashSpeed = 400;
        this.position.x += this.dashDirection.x * dashSpeed * deltaTime;
        this.position.y += this.dashDirection.y * dashSpeed * deltaTime;

        if (this.invulnerableTimer <= 0) {
            this.isDashing = false;
        }
    }

    collectPickups(game) {
        const pickupRangeSquared = this.stats.pickupRange * this.stats.pickupRange;
        
        for (let i = game.pickups.length - 1; i >= 0; i--) {
            const pickup = game.pickups[i];
            const distSquared = this.position.distanceSquaredTo(pickup.position);
            
            if (distSquared < pickupRangeSquared) {
                pickup.collect(this, game);
                game.pickups.splice(i, 1);
            }
        }
    }

    render(ctx, camera) {
        const screenPos = this.getScreenPosition(camera);
        
        ctx.save();
        ctx.translate(screenPos.x, screenPos.y);
        
        // Flash effect when damaged
        if (this.damageFlashTimer > 0) {
            ctx.globalAlpha = 0.5;
        } else if (this.isDashing) {
            ctx.globalAlpha = 0.8;
        }
        
        // Player always uses playerdown.png, just rotated for direction
        const image = imageLoader.getImage('playerDown');
        let rotation = 0;
        
        // Rotate the player image based on facing direction
        switch (this.facingDirection) {
            case 'down':
                // Default orientation (no rotation)
                break;
            case 'up':
                rotation = Math.PI; // 180 degrees
                break;
            case 'right':
                rotation = -Math.PI / 2; // -90 degrees
                break;
            case 'left':
                rotation = Math.PI / 2; // 90 degrees
                break;
        }
        
        if (image) {
            // Apply rotation
            if (rotation !== 0) {
                ctx.rotate(rotation);
            }
            
            // Draw image centered
            const imgSize = 48; // Increased from 32x32 to 48x48
            ctx.drawImage(image, -imgSize/2, -imgSize/2, imgSize, imgSize);
        } else {
            // Fallback to triangle if image not loaded
            if (this.damageFlashTimer > 0) {
                ctx.fillStyle = '#ffffff';
            } else if (this.isDashing) {
                ctx.fillStyle = '#00ffff';
            } else {
                ctx.fillStyle = '#00ff00';
            }
            
            ctx.beginPath();
            ctx.moveTo(0, -this.radius);
            ctx.lineTo(-this.radius * 0.7, this.radius * 0.7);
            ctx.lineTo(this.radius * 0.7, this.radius * 0.7);
            ctx.closePath();
            ctx.fill();
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        ctx.restore();
    }

    takeDamage(amount) {
        if (this.invulnerableTimer > 0) return;
        
        const actualDamage = Math.max(1, amount - this.stats.armor);
        this.stats.hp -= actualDamage;
        this.damageFlashTimer = 0.1;
        
        if (this.stats.hp <= 0) {
            this.stats.hp = 0;
            this.kill();
        }
    }

    heal(amount) {
        this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + amount);
    }

    addXP(amount, game) {
        this.xp += amount;
        
        while (this.xp >= this.xpToNextLevel) {
            this.xp -= this.xpToNextLevel;
            this.levelUp(game);
        }
    }

    levelUp(game) {
        this.level++;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.2);
        
        game.ui.showLevelUpModal(game);
    }

    addWeapon(weapon) {
        this.weapons.push(weapon);
    }

    getHpPercent() {
        return this.stats.hp / this.stats.maxHp;
    }

    getXpPercent() {
        return this.xp / this.xpToNextLevel;
    }
}

class Weapon {
    constructor(name, owner, stats) {
        this.name = name;
        this.owner = owner;
        this.stats = stats;
        this.level = 1;
        this.fireTimer = 0;
    }

    update(deltaTime, game) {
        this.fireTimer += deltaTime;
        
        const fireInterval = 1 / this.stats.fireRate;
        if (this.fireTimer >= fireInterval) {
            this.fire(game);
            this.fireTimer = 0;
        }
    }

    fire(game) {
        // Override in subclasses
    }

    upgrade() {
        // Override in subclasses
    }

    getUpgradeDescription() {
        // Override in subclasses
        return '';
    }
}

class SMG extends Weapon {
    constructor(owner) {
        const stats = {
            damage: 8,
            fireRate: 5,
            projectileCount: 1,
            pierce: 0,
            range: 400,
            projectileSpeed: 500,
            spread: 0.1
        };
        
        super('SMG', owner, stats);
    }

    fire(game) {
        if (game.enemies.length === 0) return;
        
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

    findNearestEnemy(game) {
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

    upgrade() {
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

    getUpgradeDescription() {
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

class Shotgun extends Weapon {
    constructor(owner) {
        const stats = {
            damage: 15,
            fireRate: 2,
            projectileCount: 5,
            pierce: 0,
            range: 250,
            projectileSpeed: 600,
            spread: 0.6
        };
        
        super('Shotgun', owner, stats);
    }

    fire(game) {
        if (game.enemies.length === 0) return;
        
        const target = this.findNearestEnemy(game);
        if (!target) return;
        
        const angleToTarget = Math.atan2(
            target.position.y - this.owner.position.y,
            target.position.x - this.owner.position.x
        );
        
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

    findNearestEnemy(game) {
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

    upgrade() {
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

    getUpgradeDescription() {
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

class Projectile extends Entity {
    constructor(x, y, angle, speed, damage, maxRange, pierce, color) {
        super(x, y, 4);
        this.direction = Vector2D.fromAngle(angle);
        this.speed = speed;
        this.damage = damage;
        this.maxRange = maxRange;
        this.distanceTraveled = 0;
        this.pierce = pierce;
        this.hitEnemies = new Set();
        this.color = color;
    }

    update(deltaTime, game) {
        const movement = this.direction.clone().multiply(this.speed * deltaTime);
        this.position.add(movement);
        this.distanceTraveled += movement.length();

        if (this.distanceTraveled > this.maxRange) {
            this.kill();
            return;
        }

        for (let i = 0; i < game.enemies.length; i++) {
            const enemy = game.enemies[i];
            
            if (this.hitEnemies.has(i)) continue;
            
            if (this.collidesWith(enemy)) {
                enemy.takeDamage(this.damage, game);
                this.hitEnemies.add(i);
                
                if (this.hitEnemies.size > this.pierce) {
                    this.kill();
                    return;
                }
            }
        }
    }

    render(ctx, camera) {
        const screenPos = this.getScreenPosition(camera);
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

class Enemy extends Entity {
    constructor(x, y, radius, stats) {
        super(x, y, radius);
        this.stats = stats;
        this.attackTimer = 0;
        this.damageFlashTimer = 0;
        this.color = '#ff0000';
        
        // Animation properties
        this.animationTimer = 0;
        this.animationSpeed = 0.3; // seconds per frame
        this.currentFrame = 0;
        this.facingDirection = 'down';
    }

    update(deltaTime, game) {
        if (this.attackTimer > 0) this.attackTimer -= deltaTime;
        if (this.damageFlashTimer > 0) this.damageFlashTimer -= deltaTime;

        const direction = new Vector2D(
            game.player.position.x - this.position.x,
            game.player.position.y - this.position.y
        ).normalize();

        // Update facing direction based on movement
        if (direction.x !== 0 || direction.y !== 0) {
            if (Math.abs(direction.x) > Math.abs(direction.y)) {
                this.facingDirection = direction.x > 0 ? 'right' : 'left';
            } else {
                this.facingDirection = direction.y > 0 ? 'down' : 'up';
            }
        }

        this.velocity = direction.multiply(this.stats.moveSpeed);
        this.position.add(new Vector2D(this.velocity.x * deltaTime, this.velocity.y * deltaTime));

        // Update animation
        this.updateAnimation(deltaTime);

        if (this.collidesWith(game.player) && this.attackTimer <= 0) {
            this.attackPlayer(game.player);
            this.attackTimer = this.stats.attackCooldown;
        }
    }

    updateAnimation(deltaTime) {
        this.animationTimer += deltaTime;
        if (this.animationTimer >= this.animationSpeed) {
            this.animationTimer = 0;
            this.currentFrame = (this.currentFrame + 1) % 2; // Switch between 0 and 1
        }
    }

    attackPlayer(player) {
        player.takeDamage(this.stats.damage);
    }

    takeDamage(amount, game) {
        this.stats.hp -= amount;
        this.damageFlashTimer = 0.1;

        if (this.stats.hp <= 0) {
            this.die(game);
        }
    }

    die(game) {
        this.kill();
        game.player.kills++;
        this.dropXP(game);
    }

    dropXP(game) {
        const pickup = new Pickup(
            this.position.x,
            this.position.y,
            'xp',
            this.stats.xpValue
        );
        game.pickups.push(pickup);
    }

    render(ctx, camera) {
        const screenPos = this.getScreenPosition(camera);
        
        ctx.save();
        ctx.translate(screenPos.x, screenPos.y);
        
        // Flash effect when damaged
        if (this.damageFlashTimer > 0) {
            ctx.globalAlpha = 0.5;
        }
        
        // Get the appropriate zombie image based on facing direction and animation
        let image = null;
        let scaleX = 1;
        let scaleY = 1;
        
        const frameName = this.currentFrame === 0 ? '01' : '02';
        
        switch (this.facingDirection) {
            case 'down':
                image = imageLoader.getImage(`zombieWalkingDown${frameName}`);
                break;
            case 'up':
                image = imageLoader.getImage(`zombieWalkingDown${frameName}`);
                scaleY = -1; // Flip vertically for up
                break;
            case 'right':
                image = imageLoader.getImage(`zombieWalkingRight${frameName}`);
                break;
            case 'left':
                image = imageLoader.getImage(`zombieWalkingRight${frameName}`);
                scaleX = -1; // Flip horizontally for left
                break;
        }
        
        if (image) {
            // Apply transformations
            if (scaleX !== 1 || scaleY !== 1) {
                ctx.scale(scaleX, scaleY);
            }
            
            // Draw image centered
            const imgSize = 48; // Increased from 32x32 to 48x48
            ctx.drawImage(image, -imgSize/2, -imgSize/2, imgSize, imgSize);
        } else {
            // Fallback to circle if image not loaded
            if (this.damageFlashTimer > 0) {
                ctx.fillStyle = '#ffffff';
            } else {
                ctx.fillStyle = this.color;
            }
            
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        ctx.restore();
        
        // Draw HP bar above enemy
        if (this.stats.hp < this.stats.maxHp) {
            const barWidth = this.radius * 2;
            const barHeight = 4;
            const hpPercent = this.stats.hp / this.stats.maxHp;
            
            ctx.fillStyle = '#000000';
            ctx.fillRect(screenPos.x - barWidth/2, screenPos.y - this.radius - 8, barWidth, barHeight);
            
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(screenPos.x - barWidth/2, screenPos.y - this.radius - 8, barWidth * hpPercent, barHeight);
        }
    }
}

class Walker extends Enemy {
    constructor(x, y) {
        const stats = {
            maxHp: 30,
            hp: 30,
            damage: 10,
            moveSpeed: 40,
            xpValue: 1,
            attackCooldown: 1.0
        };
        
        super(x, y, 12, stats);
        this.color = '#884444';
    }
}

class Runner extends Enemy {
    constructor(x, y) {
        const stats = {
            maxHp: 15,
            hp: 15,
            damage: 8,
            moveSpeed: 100,
            xpValue: 2,
            attackCooldown: 0.8
        };
        
        super(x, y, 10, stats);
        this.color = '#ff4444';
    }
}

class Boss extends Enemy {
    constructor(x, y) {
        const stats = {
            maxHp: 500,
            hp: 500,
            damage: 20,
            moveSpeed: 30,
            xpValue: 50,
            attackCooldown: 1.5
        };
        
        super(x, y, 32, stats);
        this.color = '#880000';
        this.specialAttackTimer = 0;
        this.specialAttackCooldown = 5.0;
    }

    update(deltaTime, game) {
        super.update(deltaTime, game);
        
        this.specialAttackTimer -= deltaTime;
        
        if (this.specialAttackTimer <= 0) {
            this.specialAttack(game);
            this.specialAttackTimer = this.specialAttackCooldown;
        }
    }

    specialAttack(game) {
        const originalSpeed = this.stats.moveSpeed;
        this.stats.moveSpeed = 150;
        
        setTimeout(() => {
            this.stats.moveSpeed = originalSpeed;
        }, 1000);
    }

    render(ctx, camera) {
        super.render(ctx, camera);
        
        const screenPos = this.getScreenPosition(camera);
        
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.moveTo(screenPos.x, screenPos.y - this.radius - 10);
        ctx.lineTo(screenPos.x - 8, screenPos.y - this.radius - 4);
        ctx.lineTo(screenPos.x, screenPos.y - this.radius - 6);
        ctx.lineTo(screenPos.x + 8, screenPos.y - this.radius - 4);
        ctx.closePath();
        ctx.fill();
    }
}

class Pickup extends Entity {
    constructor(x, y, type, value) {
        super(x, y, 8);
        this.type = type;
        this.value = value;
        this.lifetime = 30;
        this.bobOffset = Math.random() * Math.PI * 2;
        this.bobSpeed = 3;
    }

    update(deltaTime, game) {
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
        } else if (shape === 'cross') {
            const size = this.radius * 0.6;
            ctx.fillRect(-size/2, -this.radius, size, this.radius * 2);
            ctx.fillRect(-this.radius, -size/2, this.radius * 2, size);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        
        ctx.restore();
    }
}

class WaveManager {
    constructor() {
        this.gameTime = 0;
        this.spawnTimer = 0;
        this.bossSpawned = false;
        this.maxEnemies = 60;
        
        this.waves = [
            {
                startTime: 0,
                endTime: 120,
                spawnRate: 8,
                enemyTypes: [{ type: 'walker', weight: 1 }]
            },
            {
                startTime: 120,
                endTime: 180,
                spawnRate: 12,
                enemyTypes: [
                    { type: 'walker', weight: 0.7 },
                    { type: 'runner', weight: 0.3 }
                ]
            },
            {
                startTime: 180,
                endTime: 300,
                spawnRate: 10,
                enemyTypes: [
                    { type: 'walker', weight: 0.6 },
                    { type: 'runner', weight: 0.4 }
                ]
            },
            {
                startTime: 300,
                endTime: 420,
                spawnRate: 15,
                enemyTypes: [
                    { type: 'walker', weight: 0.5 },
                    { type: 'runner', weight: 0.5 }
                ]
            },
            {
                startTime: 420,
                endTime: 720,
                spawnRate: 20,
                enemyTypes: [
                    { type: 'walker', weight: 0.4 },
                    { type: 'runner', weight: 0.6 }
                ]
            }
        ];
    }

    update(deltaTime, game) {
        this.gameTime += deltaTime;
        
        if (this.gameTime >= 180 && !this.bossSpawned) {
            this.spawnBoss(game);
            this.bossSpawned = true;
        }
        
        if (game.enemies.length >= this.maxEnemies) {
            return;
        }
        
        const waveConfig = this.getCurrentWave();
        if (!waveConfig) return;
        
        this.spawnTimer += deltaTime;
        const spawnInterval = 1 / waveConfig.spawnRate;
        
        while (this.spawnTimer >= spawnInterval && game.enemies.length < this.maxEnemies) {
            this.spawnTimer -= spawnInterval;
            this.spawnEnemy(waveConfig, game);
        }
    }

    getCurrentWave() {
        for (const wave of this.waves) {
            if (this.gameTime >= wave.startTime && this.gameTime < wave.endTime) {
                return wave;
            }
        }
        
        return this.waves[this.waves.length - 1];
    }

    spawnEnemy(waveConfig, game) {
        const totalWeight = waveConfig.enemyTypes.reduce((sum, et) => sum + et.weight, 0);
        let random = Math.random() * totalWeight;
        
        let enemyType = 'walker';
        for (const et of waveConfig.enemyTypes) {
            random -= et.weight;
            if (random <= 0) {
                enemyType = et.type;
                break;
            }
        }
        
        const spawnPos = this.getSpawnPosition(game);
        
        let enemy;
        switch (enemyType) {
            case 'runner':
                enemy = new Runner(spawnPos.x, spawnPos.y);
                break;
            default:
                enemy = new Walker(spawnPos.x, spawnPos.y);
                break;
        }
        
        game.enemies.push(enemy);
    }

    spawnBoss(game) {
        const spawnPos = this.getSpawnPosition(game);
        const boss = new Boss(spawnPos.x, spawnPos.y);
        game.enemies.push(boss);
    }

    getSpawnPosition(game) {
        const player = game.player;
        const spawnDistance = 400;
        
        const angle = Math.random() * Math.PI * 2;
        const x = player.position.x + Math.cos(angle) * spawnDistance;
        const y = player.position.y + Math.sin(angle) * spawnDistance;
        
        return { x, y };
    }

    getGameTime() {
        return this.gameTime;
    }

    getFormattedTime() {
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = Math.floor(this.gameTime % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

class UIManager {
    constructor() {
        this.levelUpModalVisible = false;
        this.gameOverVisible = false;
    }

    update(game) {
        this.updateHUD(game);
    }

    updateHUD(game) {
        const hpText = document.getElementById('hpText');
        const hpBar = document.getElementById('hpBar');
        if (hpText && hpBar) {
            hpText.textContent = Math.ceil(game.player.stats.hp).toString();
            hpBar.style.width = `${game.player.getHpPercent() * 100}%`;
        }

        const levelText = document.getElementById('levelText');
        const xpBar = document.getElementById('xpBar');
        if (levelText && xpBar) {
            levelText.textContent = game.player.level.toString();
            xpBar.style.width = `${game.player.getXpPercent() * 100}%`;
        }

        const killsText = document.getElementById('killsText');
        if (killsText) {
            killsText.textContent = game.player.kills.toString();
        }

        const timer = document.getElementById('timer');
        if (timer) {
            timer.textContent = game.waveManager.getFormattedTime();
        }
    }

    showLevelUpModal(game) {
        if (this.levelUpModalVisible) return;
        
        this.levelUpModalVisible = true;
        game.paused = true;

        const options = this.generateUpgradeOptions(game);
        const modal = this.createLevelUpModal(options, game);
        const ui = document.getElementById('ui');
        if (ui) {
            ui.appendChild(modal);
        }
    }

    createLevelUpModal(options, game) {
        const modal = document.createElement('div');
        modal.className = 'levelup-modal';
        
        const title = document.createElement('div');
        title.className = 'levelup-title';
        title.textContent = 'LEVEL UP!';
        modal.appendChild(title);

        for (const option of options) {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'upgrade-option';
            
            const name = document.createElement('div');
            name.className = 'upgrade-name';
            name.textContent = option.name;
            optionDiv.appendChild(name);
            
            const desc = document.createElement('div');
            desc.className = 'upgrade-desc';
            desc.textContent = option.description;
            optionDiv.appendChild(desc);
            
            optionDiv.addEventListener('click', () => {
                option.apply(game);
                this.closeLevelUpModal(game);
            });
            
            modal.appendChild(optionDiv);
        }

        return modal;
    }

    closeLevelUpModal(game) {
        const modal = document.querySelector('.levelup-modal');
        if (modal) {
            modal.remove();
        }
        
        this.levelUpModalVisible = false;
        game.paused = false;
    }

    generateUpgradeOptions(game) {
        const options = [];
        
        for (const weapon of game.player.weapons) {
            if (weapon.level < 5) {
                options.push({
                    name: `${weapon.name} Level ${weapon.level + 1}`,
                    description: weapon.getUpgradeDescription(),
                    apply: () => weapon.upgrade()
                });
            }
        }

        const hasSmg = game.player.weapons.some(w => w.name === 'SMG');
        const hasShotgun = game.player.weapons.some(w => w.name === 'Shotgun');

        if (!hasSmg) {
            options.push({
                name: 'SMG',
                description: 'High fire rate, moderate damage',
                apply: (g) => {
                    const smg = new SMG(g.player);
                    g.player.addWeapon(smg);
                }
            });
        }

        if (!hasShotgun) {
            options.push({
                name: 'Shotgun',
                description: 'Cone burst, high damage',
                apply: (g) => {
                    const shotgun = new Shotgun(g.player);
                    g.player.addWeapon(shotgun);
                }
            });
        }

        options.push({
            name: '+10% Move Speed',
            description: 'Move faster',
            apply: (g) => {
                g.player.stats.moveSpeed *= 1.1;
            }
        });

        options.push({
            name: '+20 Max HP',
            description: 'Increase maximum health',
            apply: (g) => {
                g.player.stats.maxHp += 20;
                g.player.stats.hp += 20;
            }
        });

        options.push({
            name: '+1 Armor',
            description: 'Reduce damage taken',
            apply: (g) => {
                g.player.stats.armor += 1;
            }
        });

        const shuffled = options.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
    }

    showGameOver(game, victory) {
        if (this.gameOverVisible) return;
        
        this.gameOverVisible = true;
        game.paused = true;

        const modal = document.createElement('div');
        modal.className = victory ? 'game-over victory' : 'game-over';
        
        const title = document.createElement('div');
        title.className = 'game-over-title';
        title.textContent = victory ? 'VICTORY!' : 'GAME OVER';
        modal.appendChild(title);

        const stats = document.createElement('div');
        stats.style.color = victory ? '#00ff00' : '#ff0000';
        stats.style.fontSize = '20px';
        stats.style.marginTop = '20px';
        stats.innerHTML = `
            Time Survived: ${game.waveManager.getFormattedTime()}<br>
            Kills: ${game.player.kills}<br>
            Level Reached: ${game.player.level}
        `;
        modal.appendChild(stats);

        const restartBtn = document.createElement('button');
        restartBtn.className = 'restart-btn';
        restartBtn.textContent = 'Restart';
        restartBtn.addEventListener('click', () => {
            window.location.reload();
        });
        modal.appendChild(restartBtn);

        const ui = document.getElementById('ui');
        if (ui) {
            ui.appendChild(modal);
        }
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get 2D context');
        }
        this.ctx = ctx;

        this.input = new InputManager();
        this.camera = new Camera();
        this.waveManager = new WaveManager();
        this.ui = new UIManager();

        this.player = new Player(640, 360);
        
        const smg = new SMG(this.player);
        this.player.addWeapon(smg);

        this.enemies = [];
        this.projectiles = [];
        this.pickups = [];
        
        this.paused = false;
        this.gameOver = false;
        
        this.lastTime = 0;
    }

    start() {
        this.lastTime = performance.now();
        this.gameLoop();
    }

    gameLoop = () => {
        const currentTime = performance.now();
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;

        if (!this.paused && !this.gameOver) {
            this.update(deltaTime);
        }
        
        this.render();

        requestAnimationFrame(this.gameLoop);
    };

    update(deltaTime) {
        this.player.update(deltaTime, this);

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(deltaTime, this);
            
            if (enemy.isDead) {
                this.enemies.splice(i, 1);
            }
        }

        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update(deltaTime, this);
            
            if (projectile.isDead) {
                this.projectiles.splice(i, 1);
            }
        }

        for (let i = this.pickups.length - 1; i >= 0; i--) {
            const pickup = this.pickups[i];
            pickup.update(deltaTime, this);
            
            if (pickup.isDead) {
                this.pickups.splice(i, 1);
            }
        }

        this.waveManager.update(deltaTime, this);

        this.camera.setTarget(
            this.player.position.x,
            this.player.position.y,
            this.canvas.width,
            this.canvas.height
        );
        this.camera.update();

        this.ui.update(this);

        if (this.player.isDead) {
            this.triggerGameOver(false);
        }

        if (this.waveManager.getGameTime() >= 420) {
            this.triggerGameOver(true);
        }
    }

    render() {
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground();

        for (const pickup of this.pickups) {
            pickup.render(this.ctx, this.camera.position);
        }

        for (const enemy of this.enemies) {
            enemy.render(this.ctx, this.camera.position);
        }

        for (const projectile of this.projectiles) {
            projectile.render(this.ctx, this.camera.position);
        }

        this.player.render(this.ctx, this.camera.position);

        this.drawDebugInfo();
    }

    drawBackground() {
        const tileSize = 64;
        const gridColor = '#2a2a2a';
        
        this.ctx.strokeStyle = gridColor;
        this.ctx.lineWidth = 1;

        const startX = Math.floor(this.camera.position.x / tileSize) * tileSize;
        const startY = Math.floor(this.camera.position.y / tileSize) * tileSize;
        const endX = startX + this.canvas.width + tileSize;
        const endY = startY + this.canvas.height + tileSize;

        for (let x = startX; x <= endX; x += tileSize) {
            const screenX = x - this.camera.position.x;
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, 0);
            this.ctx.lineTo(screenX, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = startY; y <= endY; y += tileSize) {
            const screenY = y - this.camera.position.y;
            this.ctx.beginPath();
            this.ctx.moveTo(0, screenY);
            this.ctx.lineTo(this.canvas.width, screenY);
            this.ctx.stroke();
        }
    }

    drawDebugInfo() {
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`Enemies: ${this.enemies.length}`, 10, this.canvas.height - 60);
        this.ctx.fillText(`Projectiles: ${this.projectiles.length}`, 10, this.canvas.height - 45);
        this.ctx.fillText(`Pickups: ${this.pickups.length}`, 10, this.canvas.height - 30);
        this.ctx.fillText(`FPS: ${Math.round(1 / (performance.now() - this.lastTime) * 1000)}`, 10, this.canvas.height - 15);
    }

    triggerGameOver(victory) {
        if (this.gameOver) return;
        
        this.gameOver = true;
        this.ui.showGameOver(this, victory);
    }
}

// Initialize the game when the page loads
async function main() {
    const canvas = document.getElementById('gameCanvas');
    
    if (!canvas) {
        console.error('Could not find game canvas');
        return;
    }

    // Show loading message
    const loadingDiv = document.createElement('div');
    loadingDiv.style.position = 'absolute';
    loadingDiv.style.top = '50%';
    loadingDiv.style.left = '50%';
    loadingDiv.style.transform = 'translate(-50%, -50%)';
    loadingDiv.style.color = '#00ff00';
    loadingDiv.style.fontSize = '24px';
    loadingDiv.style.fontFamily = 'monospace';
    loadingDiv.textContent = 'Loading images...';
    document.body.appendChild(loadingDiv);

    try {
        // Load all images first
        await imageLoader.loadAllImages();
        
        // Remove loading message
        loadingDiv.remove();
        
        // Start the game
        const game = new Game(canvas);
        game.start();

        console.log('Zombie Survivor - Game Started!');
        console.log('Controls:');
        console.log('- WASD or Arrow Keys: Move');
        console.log('- Space: Dash');
    } catch (error) {
        console.error('Failed to load images:', error);
        loadingDiv.textContent = 'Failed to load images. Check console for details.';
        loadingDiv.style.color = '#ff0000';
    }
}

window.addEventListener('load', main);
