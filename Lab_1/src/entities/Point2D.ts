export class Point2D {
  public readonly x: number;

  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public equals(other: Point2D): boolean {
    return this.x === other.x && this.y === other.y;
  }

  public toString(): string {
    return `Point2D(${this.x}, ${this.y})`;
  }
}
