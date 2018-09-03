// Copyright (c) 2018 Tim Perkins

/**
 * 2D Vectors, plus some handy extras.
 *
 * Vectors should be considered immutable. Vector components are read-only. Operations like add and
 * subtract will return a new vector as their result. This may be somewhat inefficient (I haven't
 * yet measured performance), but it should prevent issues caused by accidental mutation.
 */
export class Vector {
  /**
   * The X component of the vector.
   */
  public readonly x: number;

  /**
   * The Y component of the vector.
   */
  public readonly y: number;

  private _magnitude?: number;
  private _squaredMagnitude?: number;

  /**
   * Construct a new vector from components.
   *
   * @param x The X component.
   * @param y The Y component.
   */
  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Copy a vector, optionally modifying it.
   *
   * @param vectorOptions Options to modify the vector, either the X or Y component or both can be
   * modified by this parameter options.
   * @return The copied vector.
   *
   * **Example**
   *
   *     const v1 = new Vector(2, 3);
   *     // v1 -> {x: 2, y: 3}
   *     const v2 = v1.copy({y: 5});
   *     // v2 -> {x: 2, y: 5}
   */
  public copy(vectorOptions?: {x?: number, y?: number}): Vector {
    if (vectorOptions == null) {
      return new Vector(this.x, this.y);
    } else {
      const x = vectorOptions.x != null ? vectorOptions.x : this.x;
      const y = vectorOptions.y != null ? vectorOptions.y : this.y;
      return new Vector(x, y);
    }
  }

  /**
   * Create a new vector from an object with X and Y.
   *
   * @param obj The object to convert.
   * @return The new vector.
   */
  public static fromObject(obj: {x: number, y: number}): Vector {
    return new Vector(obj.x, obj.y);
  }

  /**
   * Create a new vector from an array with two elements.
   *
   * The first element corresponds to the X component. The second element corresponds to the Y
   * component. If the array is too short, then `NaN` will be used for the missing components.
   *
   * @param obj The object to convert.
   * @return The new vector.
   */
  public static fromArray(array: number[]): Vector {
    const x = array[0] != null ? array[0] : NaN;
    const y = array[1] != null ? array[1] : NaN;
    return new Vector(x, y);
  }

  /**
   * Get a random vector between a min and max corner.
   *
   * @param minCorner The min corner (inclusive).
   * @param maxCorner The max corner (exclusive).
   * @return The random vector.
   */
  public static random(minCorner: Vector, maxCorner: Vector): Vector {
    const x = (maxCorner.x - minCorner.x) * Math.random() + minCorner.x;
    const y = (maxCorner.y - minCorner.y) * Math.random() + minCorner.y;
    return new Vector(x, y);
  }

  /**
   * Add a vector to this vector.
   *
   * @param vector The vector to add to this vector.
   * @return The vector sum.
   */
  public add(vector: Vector): Vector {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  /**
   * Subtract a vector from this vector.
   *
   * @param vector The vector to subtract from this vector.
   * @return The vector difference.
   */
  public subtract(vector: Vector): Vector {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  /**
   * Multiply this vector by a scalar.
   *
   * @param scalar The scalar to multiply this vector by.
   * @return The scaled vector.
   */
  public multiply(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  /**
   * Divide this vector by a scalar.
   *
   * @param scalar The scalar to divide this vector by.
   * @return The scaled vector.
   */
  public divide(scalar: number): Vector {
    return new Vector(this.x / scalar, this.y / scalar);
  }

  /**
   * Get the additive inverse of the vector.
   *
   * @return The inverted vector.
   */
  public inverse(): Vector {
    return new Vector(-this.x, -this.y);
  }

  /**
   * Get the normalized vector.
   *
   * This function will return a `NaN` vector if the vector has zero magnitude.
   *
   * @return The normalized vector.
   */
  public normalize(): Vector {
    const magnitude = this.magnitude();
    if (magnitude === 0.0) {
      return new Vector(NaN, NaN);
    } else {
      return new Vector(this.x / magnitude, this.y / magnitude);
    }
  }

  /**
   * Get the vector magnitude.
   *
   * @return The magnitude.
   */
  public magnitude(): number {
    if (this._magnitude != null) {
      return this._magnitude;
    } else {
      this._magnitude = Math.sqrt(this.squaredMagnitude());
      return this._magnitude;
    }
  }

  /**
   * Get the squared vector magnitude.
   *
   * @return The squared magnitude.
   */
  public squaredMagnitude(): number {
    if (this._squaredMagnitude != null) {
      return this._squaredMagnitude;
    } else {
      return this.x * this.x + this.y * this.y;
    }
  }

  /**
   * Get the distance between this vector and another vector.
   *
   * @return The distance between vectors.
   */
  public distanceTo(vector: Vector): number {
    return this.subtract(vector).magnitude();
  }

  /**
   * Get the squared distance between this vector and another vector.
   *
   * @return The squared distance between vectors.
   */
  public squaredDistanceTo(vector: Vector): number {
    return this.subtract(vector).squaredMagnitude();
  }

  /**
   * Get the angle of the vector.
   *
   * @return The angle in radians.
   */
  public angle(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Get the angle of the vector in degrees.
   *
   * @return The angle in degrees.
   */
  public angleDegrees(): number {
    return this.angle() * 180.0 / Math.PI;
  }

  /**
   * Rotate this vector by an angle.
   *
   * @param angle The angle to rotate the vector by in radians.
   * @return The rotated vector.
   */
  public rotate(angle: number): Vector {
    const x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    const y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
    return new Vector(x, y);
  }

  /**
   * Rotate this vector by an angle in degrees.
   *
   * @param angle The angle to rotate the vector by in degrees.
   * @return The rotated vector.
   */
  public rotateDegrees(angleDegrees: number): Vector {
    return this.rotate(angleDegrees * Math.PI / 180.0);
  }

  /**
   * Round this vector to integers.
   *
   * @return The rounded, integer vector.
   */
  public round(): Vector {
    return new Vector(Math.round(this.x), Math.round(this.y));
  }

  /**
   * Decompose this vector into orthogonal X and Y vectors.
   *
   * @return The orthogonal X and Y vectors.
   */
  public decompose(): {x: Vector, y: Vector} {
    return {x: this.copy({y: 0.0}), y: this.copy({x: 0.0})};
  }

  /**
   * Clamp the vector to the given rectangular region.
   *
   * @param minCorner The min corner.
   * @param maxCorner The max corner.
   * @return The clamped vector.
   */
  public clamp(minCorner: Vector, maxCorner: Vector): Vector {
    const x = Math.max(minCorner.x, Math.min(this.x, maxCorner.x));
    const y = Math.max(minCorner.y, Math.min(this.y, maxCorner.y));
    return new Vector(x, y);
  }

  /**
   * Expel the vector from the given rectangular region.
   *
   * Moves the vector to the closest egde. If the vector is equidistant to two or more edges, the
   * edge it will be moved to is unspecified.
   *
   * @param minCorner The min corner.
   * @param maxCorner The max corner.
   * @return The expelled vector.
   */
  public expel(minCorner: Vector, maxCorner: Vector): Vector {
    if ((this.x <= minCorner.x || maxCorner.x <= this.x)
        || (this.y <= minCorner.y || maxCorner.y <= this.y)) {
      return this.copy();
    } else {
      const deltaMin = minCorner.subtract(this).decompose();
      const deltaMax = maxCorner.subtract(this).decompose();
      const adjust = _.min(
          [deltaMin.x, deltaMin.y, deltaMax.x, deltaMax.y],
          (vector) => vector.squaredMagnitude(),
      );
      return this.add(adjust);
    }
  }

  /**
   * Test if either vector component is `NaN`.
   *
   * @return True if either vector component is `NaN`, false otherwise.
   */
  public isNaN(): boolean {
    return Number.isNaN(this.x) || Number.isNaN(this.y);
  }

  /**
   * Convert this vector to an object.
   *
   * @return An object in the form `{x: X, y: Y}`.
   */
  public toObject(): {x: number, y: number} {
    return {x: this.x, y: this.y};
  }

  /**
   * Convert this vector to an array.
   *
   * @return An array with two elements, in the form `[X, Y]`.
   */
  public toArray(): number[] {
    return [this.x, this.y];
  }

  /**
   * Convert this vector to a string.
   *
   * @return A JSON string in the form `"{x: X, y: Y}"`.
   */
  public toString(): string {
    return JSON.stringify(this.toObject());
  }
}
