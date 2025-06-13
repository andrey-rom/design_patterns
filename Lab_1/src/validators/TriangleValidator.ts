import { IValidator } from './IValidator';
import { Triangle } from '../entities/Triangle';
import { Point2D } from '../entities/Point2D';
import { PRECISION, VALIDATION_PATTERNS } from '../constants';
import { ValidationException } from '../exceptions/GeometryExceptions';

export interface TriangleData {
  pointA: Point2D;
  pointB: Point2D;
  pointC: Point2D;
}

export class TriangleValidator implements IValidator<TriangleData> {
  public validate(data: TriangleData): boolean {
    return this.getValidationErrors(data).length === 0;
  }

  public getValidationErrors(data: TriangleData): string[] {
    const errors: string[] = [];

    if (!this.arePointsValid(data.pointA, data.pointB, data.pointC)) {
      errors.push('Points contain invalid coordinates');
    }

    if (!this.doPointsFormTriangle(data.pointA, data.pointB, data.pointC)) {
      errors.push('Points are collinear and do not form a triangle');
    }

    return errors;
  }

  public validateTriangle(triangle: Triangle): boolean {
    return triangle.isValid() && triangle.getArea() > PRECISION;
  }

  public validateCalculationResults(area: number, perimeter: number): boolean {
    return area >= 0 && perimeter > 0 && Number.isFinite(area) && Number.isFinite(perimeter);
  }

  private arePointsValid(pointA: Point2D, pointB: Point2D, pointC: Point2D): boolean {
    return this.isPointValid(pointA) && this.isPointValid(pointB) && this.isPointValid(pointC);
  }

  private isPointValid(point: Point2D): boolean {
    return Number.isFinite(point.x) && Number.isFinite(point.y);
  }

  private doPointsFormTriangle(pointA: Point2D, pointB: Point2D, pointC: Point2D): boolean {
    const abX = pointB.x - pointA.x;
    const abY = pointB.y - pointA.y;
    const acX = pointC.x - pointA.x;
    const acY = pointC.y - pointA.y;

    const area = Math.abs((abX * acY) - (abY * acX)) / 2;
    return area > PRECISION;
  }

  public validateInputData(data: string[]): void {
    if (data.length < 6) {
      throw new ValidationException(`Triangle requires 6 coordinates, got ${data.length}`);
    }
  }

  public parseCoordinates(data: string[]): number[] {
    const coordinates: number[] = [];

    for (const value of data) {
      if (!VALIDATION_PATTERNS.NUMBER.test(value)) {
        throw new ValidationException(`Invalid coordinate value: ${value}`);
      }

      const coordinate = parseFloat(value);
      if (!Number.isFinite(coordinate)) {
        throw new ValidationException(`Invalid coordinate value: ${value}`);
      }

      coordinates.push(coordinate);
    }

    return coordinates;
  }
}
