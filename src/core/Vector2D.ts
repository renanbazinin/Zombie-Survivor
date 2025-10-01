/**
 * 2D Vector utility class for positions, velocities, and directions
 */
export class Vector2D {
    constructor(public x: number = 0, public y: number = 0) {}

    /**
     * Create a copy of this vector
     */
    clone(): Vector2D {
        return new Vector2D(this.x, this.y);
    }

    /**
     * Add another vector to this one
     */
    add(other: Vector2D): Vector2D {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    /**
     * Subtract another vector from this one
     */
    subtract(other: Vector2D): Vector2D {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    /**
     * Multiply by a scalar
     */
    multiply(scalar: number): Vector2D {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    /**
     * Get the length (magnitude) of this vector
     */
    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Get the squared length (faster than length, useful for comparisons)
     */
    lengthSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * Normalize this vector (make it length 1)
     */
    normalize(): Vector2D {
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
    distanceTo(other: Vector2D): number {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Get squared distance to another vector (faster)
     */
    distanceSquaredTo(other: Vector2D): number {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return dx * dx + dy * dy;
    }

    /**
     * Get angle in radians
     */
    angle(): number {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Set this vector's values
     */
    set(x: number, y: number): Vector2D {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * Create a vector from an angle
     */
    static fromAngle(angle: number, length: number = 1): Vector2D {
        return new Vector2D(Math.cos(angle) * length, Math.sin(angle) * length);
    }

    /**
     * Get a zero vector
     */
    static zero(): Vector2D {
        return new Vector2D(0, 0);
    }
}


