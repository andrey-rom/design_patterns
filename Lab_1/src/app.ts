import { FileReaderService } from './services/FileReaderService';
import { TriangleService } from './services/TriangleService';
import { CubeService } from './services/CubeService';
import { TriangleFactory } from './factories/TriangleFactory';
import { CubeFactory } from './factories/CubeFactory';
import { ShapeFactory } from './factories/ShapeFactory';
import { Triangle } from './entities/Triangle';
import { Cube } from './entities/Cube';
import { Shape } from './entities/Shape';
import logger from './utils/logger';

export class GeometryApplication {
  private fileReader: FileReaderService;

  private triangleService: TriangleService;

  private cubeService: CubeService;

  private triangleFactory: TriangleFactory;

  private cubeFactory: CubeFactory;

  constructor() {
    this.fileReader = new FileReaderService();
    this.triangleService = new TriangleService();
    this.cubeService = new CubeService();
    this.triangleFactory = new TriangleFactory();
    this.cubeFactory = new CubeFactory();
  }

  public async run(): Promise<void> {
    try {
      logger.info('Starting Geometry Application');

      await this.processTriangles();
      await this.processCubes();

      logger.info('Application completed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Application error: ${errorMessage}`);
      throw error;
    }
  }

  private async processTriangles(): Promise<void> {
    logger.info('Processing triangles from file...');

    try {
      const lines = this.fileReader.readFile('data/triangles.txt');
      const triangles = this.parseShapesFromLines(lines, this.triangleFactory, 'triangle');
      logger.info(`Loaded ${triangles.length} triangles from file`);

      for (const shape of triangles) {
        if (shape instanceof Triangle) {
          this.analyzeTriangle(shape);
        }
      }
    } catch (error) {
      logger.error('Error processing triangles:', error);
    }
  }

  private async processCubes(): Promise<void> {
    logger.info('Processing cubes from file...');

    try {
      const lines = this.fileReader.readFile('data/cubes.txt');
      const cubes = this.parseShapesFromLines(lines, this.cubeFactory, 'cube');
      logger.info(`Loaded ${cubes.length} cubes from file`);

      for (const shape of cubes) {
        if (shape instanceof Cube) {
          this.analyzeCube(shape);
        }
      }
    } catch (error) {
      logger.error('Error processing cubes:', error);
    }
  }

  private analyzeTriangle(triangle: Triangle): void {
    logger.info(`Analyzing triangle: ${triangle.id}`);

    try {
      const analysis = this.triangleService.getTriangleAnalysis(triangle);

      logger.info(`Triangle ${triangle.id} analysis:`, {
        area: analysis.area,
        perimeter: analysis.perimeter,
        type: analysis.type,
        angleType: analysis.angleType,
        isValid: analysis.isValid,
        isRight: this.triangleService.isRightTriangle(triangle),
        isIsosceles: this.triangleService.isIsoscelesTriangle(triangle),
        isEquilateral: this.triangleService.isEquilateralTriangle(triangle),
      });
    } catch (error) {
      logger.error(`Error analyzing triangle ${triangle.id}:`, error);
    }
  }

  private analyzeCube(cube: Cube): void {
    logger.info(`Analyzing cube: ${cube.id}`);

    try {
      const analysis = this.cubeService.getCubeAnalysis(cube);

      const volumeRatioXY = this.cubeService.calculateVolumeRatioByPlane(cube, 'xy', 0);
      const volumeRatioXZ = this.cubeService.calculateVolumeRatioByPlane(cube, 'xz', 0);
      const volumeRatioYZ = this.cubeService.calculateVolumeRatioByPlane(cube, 'yz', 0);

      logger.info(`Cube ${cube.id} analysis:`, {
        surfaceArea: analysis.surfaceArea,
        volume: analysis.volume,
        isValid: analysis.isValid,
        baseOnPlanes: analysis.baseOnPlanes,
        volumeRatios: {
          xy: volumeRatioXY.ratio,
          xz: volumeRatioXZ.ratio,
          yz: volumeRatioYZ.ratio,
        },
      });
    } catch (error) {
      logger.error(`Error analyzing cube ${cube.id}:`, error);
    }
  }

  private parseShapesFromLines(lines: string[], factory: ShapeFactory, shapeType: string): Shape[] {
    const shapes: Shape[] = [];
    let validCount = 0;
    let invalidCount = 0;

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const lineNumber = i + 1;

      if (!line) {
        continue;
      }

      try {
        const shape = factory.createShapeFromString(`${shapeType}_${lineNumber}`, line);
        shapes.push(shape);
        validCount += 1;
        logger.info(`Successfully created ${shapeType} from line ${lineNumber}: ${line}`);
      } catch (error) {
        invalidCount += 1;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.warn(`Skipping invalid line ${lineNumber}: ${line} - ${errorMessage}`);
      }
    }

    logger.info('Shape parsing completed', {
      totalLines: lines.length,
      validShapes: validCount,
      invalidLines: invalidCount,
      shapeType,
    });

    return shapes;
  }
}

async function main(): Promise<void> {
  const app = new GeometryApplication();
  await app.run();
}

main().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});
