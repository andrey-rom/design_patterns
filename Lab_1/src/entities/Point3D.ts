export class Point3D {
  public readonly x: number;

  public readonly y: number;

  public readonly z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public equals(other: Point3D): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  public toString(): string {
    return `Point3D(${this.x}, ${this.y}, ${this.z})`;
  }
}
