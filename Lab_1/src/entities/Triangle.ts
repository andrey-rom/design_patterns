import { Shape } from './Shape';
import { Point2D } from './Point2D';

export class Triangle extends Shape {
  public readonly pointA: Point2D;

  public readonly pointB: Point2D;

  public readonly pointC: Point2D;

  constructor(id: string, pointA: Point2D, pointB: Point2D, pointC: Point2D, name?: string) {
    super(id, name);
    this.pointA = pointA;
    this.pointB = pointB;
    this.pointC = pointC;
  }

  public getArea(): number {
    const abX = this.pointB.x - this.pointA.x;
    const abY = this.pointB.y - this.pointA.y;
    const acX = this.pointC.x - this.pointA.x;
    const acY = this.pointC.y - this.pointA.y;

    return Math.abs((abX * acY) - (abY * acX)) / 2;
  }

  public getPerimeter(): number {
    const sideAB = this.calculateDistance(this.pointA, this.pointB);
    const sideBC = this.calculateDistance(this.pointB, this.pointC);
    const sideCA = this.calculateDistance(this.pointC, this.pointA);

    return sideAB + sideBC + sideCA;
  }

  public isValid(): boolean {
    return this.getArea() > 0;
  }

  public getSides(): [number, number, number] {
    const sideAB = this.calculateDistance(this.pointA, this.pointB);
    const sideBC = this.calculateDistance(this.pointB, this.pointC);
    const sideCA = this.calculateDistance(this.pointC, this.pointA);

    return [sideAB, sideBC, sideCA];
  }

  private calculateDistance(point1: Point2D, point2: Point2D): number {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
