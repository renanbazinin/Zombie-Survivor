/**
 * 2D Vector utility class for positions, velocities, and directions
 */
export declare class Vector2D {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    /**
     * Create a copy of this vector
     */
    clone(): Vector2D;
    /**
     * Add another vector to this one
     */
    add(other: Vector2D): Vector2D;
    /**
     * Subtract another vector from this one
     */
    subtract(other: Vector2D): Vector2D;
    /**
     * Multiply by a scalar
     */
    multiply(scalar: number): Vector2D;
    /**
     * Get the length (magnitude) of this vector
     */
    length(): number;
    /**
     * Get the squared length (faster than length, useful for comparisons)
     */
    lengthSquared(): number;
    /**
     * Normalize this vector (make it length 1)
     */
    normalize(): Vector2D;
    /**
     * Get distance to another vector
     */
    distanceTo(other: Vector2D): number;
    /**
     * Get squared distance to another vector (faster)
     */
    distanceSquaredTo(other: Vector2D): number;
    /**
     * Get angle in radians
     */
    angle(): number;
    /**
     * Set this vector's values
     */
    set(x: number, y: number): Vector2D;
    /**
     * Create a vector from an angle
     */
    static fromAngle(angle: number, length?: number): Vector2D;
    /**
     * Get a zero vector
     */
    static zero(): Vector2D;
}
//# sourceMappingURL=Vector2D.d.ts.map