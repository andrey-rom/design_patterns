import { Cube } from '../entities/Cube';
import { Point3D } from '../entities/Point3D';
import { CubeValidator } from '../validators/CubeValidator';
import { PRECISION } from '../constants';
import logger from '../utils/logger';

export class CubeService {
  private validator: CubeValidator;

  constructor() {
    this.validator = new CubeValidator();
  }

  public calculateSurfaceArea(cube: Cube): number {
    const area = cube.getArea();

    if (!this.validator.validateCalculationResults(area, cube.getVolume())) {
      throw new Error('Invalid calculation results');
    }

    logger.info(`Calculated surface area for cube ${cube.id}: ${area}`);
    return area;
  }

  public calculateVolume(cube: Cube): number {
    const volume = cube.getVolume();

    if (!this.validator.validateCalculationResults(cube.getArea(), volume)) {
      throw new Error('Invalid calculation results');
    }

    logger.info(`Calculated volume for cube ${cube.id}: ${volume}`);
    return volume;
  }

  public isBaseOnCoordinatePlane(cube: Cube): {
    onXY: boolean;
    onXZ: boolean;
    onYZ: boolean;
  } {
    const halfSide = cube.sideLength / 2;
    const { center } = cube;

    const bottomZ = center.z - halfSide;
    const bottomY = center.y - halfSide;
    const bottomX = center.x - halfSide;

    const onXY = Math.abs(bottomZ) < PRECISION;
    const onXZ = Math.abs(bottomY) < PRECISION;
    const onYZ = Math.abs(bottomX) < PRECISION;

    logger.info(`Cube ${cube.id} base placement:`, { onXY, onXZ, onYZ });

    return { onXY, onXZ, onYZ };
  }

  public calculateVolumeRatioByPlane(cube: Cube, plane: 'xy' | 'xz' | 'yz', offset: number): {
    volume1: number;
    volume2: number;
    ratio: number;
  } {
    const totalVolume = cube.getVolume();
    const halfSide = cube.sideLength / 2;

    let intersectionPoint: number;
    let cubeMin: number;
    let cubeMax: number;

    switch (plane) {
      case 'xy':
        intersectionPoint = offset;
        cubeMin = cube.center.z - halfSide;
        cubeMax = cube.center.z + halfSide;
        break;
      case 'xz':
        intersectionPoint = offset;
        cubeMin = cube.center.y - halfSide;
        cubeMax = cube.center.y + halfSide;
        break;
      case 'yz':
        intersectionPoint = offset;
        cubeMin = cube.center.x - halfSide;
        cubeMax = cube.center.x + halfSide;
        break;
      default:
        throw new Error(`Invalid plane: ${plane}`);
    }

    if (intersectionPoint <= cubeMin) {
      return { volume1: 0, volume2: totalVolume, ratio: 0 };
    }

    if (intersectionPoint >= cubeMax) {
      return { volume1: totalVolume, volume2: 0, ratio: Infinity };
    }

    const distance1 = intersectionPoint - cubeMin;
    const distance2 = cubeMax - intersectionPoint;

    const volume1 = (distance1 / cube.sideLength) * totalVolume;
    const volume2 = (distance2 / cube.sideLength) * totalVolume;
    const ratio = volume2 > 0 ? volume1 / volume2 : Infinity;

    logger.info(`Volume ratio for cube ${cube.id} divided by ${plane} plane at ${offset}:`, {
      volume1,
      volume2,
      ratio,
    });

    return { volume1, volume2, ratio };
  }

  public isCube(shape: Cube): boolean {
    const isValid = this.validator.validateCube(shape);
    const hasPositiveSideLength = shape.sideLength > PRECISION;
    const hasValidCenter = Number.isFinite(shape.center.x)
                          && Number.isFinite(shape.center.y)
                          && Number.isFinite(shape.center.z);

    const result = isValid && hasPositiveSideLength && hasValidCenter;
    logger.info(`Shape ${shape.id} is ${result ? '' : 'not '}a valid cube`);

    return result;
  }

  public getCubeAnalysis(cube: Cube): {
    surfaceArea: number;
    volume: number;
    isValid: boolean;
    baseOnPlanes: {
      onXY: boolean;
      onXZ: boolean;
      onYZ: boolean;
    };
    vertices: Point3D[];
  } {
    return {
      surfaceArea: this.calculateSurfaceArea(cube),
      volume: this.calculateVolume(cube),
      isValid: this.isCube(cube),
      baseOnPlanes: this.isBaseOnCoordinatePlane(cube),
      vertices: cube.getVertices(),
    };
  }
}
