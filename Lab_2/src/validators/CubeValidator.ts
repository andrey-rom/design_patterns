import { IValidator } from './IValidator';
import { Cube } from '../entities/Cube';
import { Point3D } from '../entities/Point3D';
import { PRECISION, VALIDATION_PATTERNS } from '../constants';
import { ValidationException } from '../exceptions/GeometryExceptions';

export interface CubeData {
  center: Point3D;
  sideLength: number;
}

export class CubeValidator implements IValidator<CubeData> {
  public validate(data: CubeData): boolean {
    return this.getValidationErrors(data).length === 0;
  }

  public getValidationErrors(data: CubeData): string[] {
    const errors: string[] = [];

    if (!this.isPointValid(data.center)) {
      errors.push('Center point contains invalid coordinates');
    }

    if (!this.isSideLengthValid(data.sideLength)) {
      errors.push('Side length must be a positive number');
    }

    return errors;
  }

  public validateCube(cube: Cube): boolean {
    return cube.isValid() && cube.sideLength > PRECISION;
  }

  public validateCalculationResults(area: number, volume: number): boolean {
    return area > 0 && volume > 0 && Number.isFinite(area) && Number.isFinite(volume);
  }

  private isPointValid(point: Point3D): boolean {
    return Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.z);
  }

  private isSideLengthValid(sideLength: number): boolean {
    return Number.isFinite(sideLength) && sideLength > 0;
  }

  public validateInputData(data: string[]): void {
    if (data.length < 4) {
      throw new ValidationException(
        `Cube requires 4 values (3 coordinates for center + side length), got ${data.length}`,
      );
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

  public parseSideLength(value: string): number {
    if (!VALIDATION_PATTERNS.POSITIVE_NUMBER.test(value)) {
      throw new ValidationException(`Invalid side length value: ${value}`);
    }

    const sideLength = parseFloat(value);
    if (!Number.isFinite(sideLength) || sideLength <= 0) {
      throw new ValidationException(`Side length must be positive: ${value}`);
    }

    return sideLength;
  }
}
