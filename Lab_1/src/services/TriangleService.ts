import { Triangle } from '../entities/Triangle';
import { Point2D } from '../entities/Point2D';
import { TriangleValidator } from '../validators/TriangleValidator';
import { PRECISION, TRIANGLE_TYPES } from '../constants';
import logger from '../utils/logger';

export class TriangleService {
  private validator: TriangleValidator;

  constructor() {
    this.validator = new TriangleValidator();
  }

  public calculateArea(triangle: Triangle): number {
    const area = triangle.getArea();

    if (!this.validator.validateCalculationResults(area, triangle.getPerimeter())) {
      throw new Error('Invalid calculation results');
    }

    logger.info(`Calculated area for triangle ${triangle.id}: ${area}`);
    return area;
  }

  public calculatePerimeter(triangle: Triangle): number {
    const perimeter = triangle.getPerimeter();

    if (!this.validator.validateCalculationResults(triangle.getArea(), perimeter)) {
      throw new Error('Invalid calculation results');
    }

    logger.info(`Calculated perimeter for triangle ${triangle.id}: ${perimeter}`);
    return perimeter;
  }

  public isTriangleValid(pointA: Point2D, pointB: Point2D, pointC: Point2D): boolean {
    const triangleData = { pointA, pointB, pointC };
    return this.validator.validate(triangleData);
  }

  public isRightTriangle(triangle: Triangle): boolean {
    const [a, b, c] = triangle.getSides().sort((x, y) => x - y);
    const isRight = Math.abs((a * a) + (b * b) - (c * c)) < PRECISION;

    logger.info(`Triangle ${triangle.id} is ${isRight ? '' : 'not '}right-angled`);
    return isRight;
  }

  public isIsoscelesTriangle(triangle: Triangle): boolean {
    const [a, b, c] = triangle.getSides().sort((x, y) => x - y);
    const isIsosceles = Math.abs(a - b) < PRECISION
                       || Math.abs(b - c) < PRECISION
                       || Math.abs(a - c) < PRECISION;

    logger.info(`Triangle ${triangle.id} is ${isIsosceles ? '' : 'not '}isosceles`);
    return isIsosceles;
  }

  public isEquilateralTriangle(triangle: Triangle): boolean {
    const [a, b, c] = triangle.getSides();
    const isEquilateral = Math.abs(a - b) < PRECISION
                         && Math.abs(b - c) < PRECISION
                         && Math.abs(a - c) < PRECISION;

    logger.info(`Triangle ${triangle.id} is ${isEquilateral ? '' : 'not '}equilateral`);
    return isEquilateral;
  }

  public getTriangleType(triangle: Triangle): string {
    if (this.isEquilateralTriangle(triangle)) {
      return TRIANGLE_TYPES.EQUILATERAL;
    }

    if (this.isIsoscelesTriangle(triangle)) {
      return TRIANGLE_TYPES.ISOSCELES;
    }

    return TRIANGLE_TYPES.SCALENE;
  }

  public getAngleType(triangle: Triangle): string {
    if (this.isRightTriangle(triangle)) {
      return TRIANGLE_TYPES.RIGHT;
    }

    const [a, b, c] = triangle.getSides().sort((x, y) => x - y);
    const largestAngleCosine = (a * a + b * b - c * c) / (2 * a * b);

    if (largestAngleCosine > PRECISION) {
      return TRIANGLE_TYPES.ACUTE;
    }

    if (largestAngleCosine < -PRECISION) {
      return TRIANGLE_TYPES.OBTUSE;
    }

    return TRIANGLE_TYPES.RIGHT;
  }

  public getTriangleAnalysis(triangle: Triangle): {
    area: number;
    perimeter: number;
    type: string;
    angleType: string;
    isValid: boolean;
  } {
    return {
      area: this.calculateArea(triangle),
      perimeter: this.calculatePerimeter(triangle),
      type: this.getTriangleType(triangle),
      angleType: this.getAngleType(triangle),
      isValid: this.validator.validateTriangle(triangle),
    };
  }
}
