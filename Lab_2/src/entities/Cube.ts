import { Shape } from './Shape';
import { Point3D } from './Point3D';

export class Cube extends Shape {
  public center: Point3D;

  public sideLength: number;

  constructor(id: string, center: Point3D, sideLength: number) {
    super(id);
    this.center = center;
    this.sideLength = sideLength;
    this.notifyObservers();
  }

  public getName(): string {
    return 'Cube';
  }

  public getArea(): number {
    return 6 * this.sideLength * this.sideLength;
  }

  public getPerimeter(): number {
    return 12 * this.sideLength;
  }

  public getVolume(): number {
    return this.sideLength * this.sideLength * this.sideLength;
  }

  public getFirstPoint(): { x: number; y: number; z: number } {
    return { x: this.center.x, y: this.center.y, z: this.center.z };
  }

  public isValid(): boolean {
    return this.sideLength > 0;
  }

  public updateCube(center: Point3D, sideLength: number): void {
    this.center = center;
    this.sideLength = sideLength;
    this.notifyObservers();
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
