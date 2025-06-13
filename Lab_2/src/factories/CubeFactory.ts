import { ShapeFactory } from './ShapeFactory';
import { Cube } from '../entities/Cube';
import { Point3D } from '../entities/Point3D';
import { CubeValidator } from '../validators/CubeValidator';
import { InvalidCubeException } from '../exceptions/GeometryExceptions';
import logger from '../utils/logger';

export class CubeFactory extends ShapeFactory {
  private validator: CubeValidator;

  constructor() {
    super();
    this.validator = new CubeValidator();
  }

  public createShape(id: string, data: string[]): Cube {
    this.validator.validateInputData(data);

    const coordinates = this.validator.parseCoordinates(data.slice(0, 3));
    const center = new Point3D(coordinates[0]!, coordinates[1]!, coordinates[2]!);

    const sideLength = this.validator.parseSideLength(data[3]!);

    const cubeData = { center, sideLength };

    if (!this.validator.validate(cubeData)) {
      const errors = this.validator.getValidationErrors(cubeData);
      throw new InvalidCubeException(`Invalid cube data: ${errors.join(', ')}`);
    }

    const cube = new Cube(id, center, sideLength);

    logger.info(`Created cube with ID: ${id}`, {
      center: center.toString(),
      sideLength,
    });

    return cube;
  }
}
