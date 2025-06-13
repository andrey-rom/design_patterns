import { ShapeFactory } from './ShapeFactory';
import { Triangle } from '../entities/Triangle';
import { Point2D } from '../entities/Point2D';
import { TriangleValidator } from '../validators/TriangleValidator';
import { InvalidTriangleException } from '../exceptions/GeometryExceptions';
import logger from '../utils/logger';

export class TriangleFactory extends ShapeFactory {
  private validator: TriangleValidator;

  constructor() {
    super();
    this.validator = new TriangleValidator();
  }

  public createShape(id: string, data: string[]): Triangle {
    this.validator.validateInputData(data);

    const coordinates = this.validator.parseCoordinates(data.slice(0, 6));

    const pointA = new Point2D(coordinates[0]!, coordinates[1]!);
    const pointB = new Point2D(coordinates[2]!, coordinates[3]!);
    const pointC = new Point2D(coordinates[4]!, coordinates[5]!);

    const triangleData = { pointA, pointB, pointC };

    if (!this.validator.validate(triangleData)) {
      const errors = this.validator.getValidationErrors(triangleData);
      throw new InvalidTriangleException(`Invalid triangle data: ${errors.join(', ')}`);
    }

    const triangle = new Triangle(id, pointA, pointB, pointC);

    logger.info(`Created triangle with ID: ${id}`, {
      pointA: pointA.toString(),
      pointB: pointB.toString(),
      pointC: pointC.toString(),
    });

    return triangle;
  }
}
