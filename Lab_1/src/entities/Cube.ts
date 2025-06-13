import { Shape } from './Shape';
import { Point3D } from './Point3D';

export class Cube extends Shape {
  public readonly center: Point3D;

  public readonly sideLength: number;

  constructor(id: string, center: Point3D, sideLength: number, name?: string) {
    super(id, name);
    this.center = center;
    this.sideLength = sideLength;
  }

  public getArea(): number {
    return 6 * this.sideLength * this.sideLength;
  }

  public getPerimeter(): undefined {
    return undefined;
  }

  public getVolume(): number {
    return this.sideLength * this.sideLength * this.sideLength;
  }

  public isValid(): boolean {
    return this.sideLength > 0;
  }

  public getVertices(): Point3D[] {
    const halfSide = this.sideLength / 2;
    const { x, y, z } = this.center;

    return [
      new Point3D(x - halfSide, y - halfSide, z - halfSide),
      new Point3D(x + halfSide, y - halfSide, z - halfSide),
      new Point3D(x + halfSide, y + halfSide, z - halfSide),
      new Point3D(x - halfSide, y + halfSide, z - halfSide),
      new Point3D(x - halfSide, y - halfSide, z + halfSide),
      new Point3D(x + halfSide, y - halfSide, z + halfSide),
      new Point3D(x + halfSide, y + halfSide, z + halfSide),
      new Point3D(x - halfSide, y + halfSide, z + halfSide),
    ];
  }
}
