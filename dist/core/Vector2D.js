/**
 * 2D Vector utility class for positions, velocities, and directions
 */
export class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    /**
     * Create a copy of this vector
     */
    clone() {
        return new Vector2D(this.x, this.y);
    }
    /**
     * Add another vector to this one
     */
    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    /**
     * Subtract another vector from this one
     */
    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    /**
     * Multiply by a scalar
     */
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    /**
     * Get the length (magnitude) of this vector
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
     * Get the squared length (faster than length, useful for comparisons)
     */
    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }
    /**
     * Normalize this vector (make it length 1)
     */
    normalize() {
        const len = this.length();
        if (len > 0) {
            this.x /= len;
            this.y /= len;
        }
        return this;
    }
    /**
     * Get distance to another vector
     */
    distanceTo(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * Get squared distance to another vector (faster)
     */
    distanceSquaredTo(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return dx * dx + dy * dy;
    }
    /**
     * Get angle in radians
     */
    angle() {
        return Math.atan2(this.y, this.x);
    }
    /**
     * Set this vector's values
     */
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    /**
     * Create a vector from an angle
     */
    static fromAngle(angle, length = 1) {
        return new Vector2D(Math.cos(angle) * length, Math.sin(angle) * length);
    }
    /**
     * Get a zero vector
     */
    static zero() {
        return new Vector2D(0, 0);
    }
}
//# sourceMappingURL=Vector2D.js.map