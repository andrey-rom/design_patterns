import { CubeService } from '../services/CubeService';
import { Cube } from '../entities/Cube';
import { Point3D } from '../entities/Point3D';

describe('CubeService', () => {
  let service: CubeService;
  let cube: Cube;

  beforeEach(() => {
    service = new CubeService();
    cube = new Cube('test', new Point3D(0, 0, 0), 2);
  });

  it('should calculate surface area', () => {
    // Given - cube with side length 2

    // When
    const result = service.calculateSurfaceArea(cube);

    // Then
    expect(result).toBe(24);
  });

  it('should calculate volume', () => {
    // Given - cube with side length 2

    // When
    const result = service.calculateVolume(cube);

    // Then
    expect(result).toBe(8);
  });

  it('should check if shape is cube', () => {
    // Given - valid cube with positive side length

    // When
    const result = service.isCube(cube);

    // Then
    expect(result).toBe(true);
  });

  it('should check base on coordinate planes', () => {
    // Given - cube centered at origin

    // When
    const result = service.isBaseOnCoordinatePlane(cube);

    // Then
    expect(result.onXY).toBe(false);
    expect(result.onXZ).toBe(false);
    expect(result.onYZ).toBe(false);
  });

  it('should calculate volume ratio by plane', () => {
    // Given - cube and XY plane through center

    // When
    const result = service.calculateVolumeRatioByPlane(cube, 'xy', 0);

    // Then
    expect(result.volume1).toBe(4);
    expect(result.volume2).toBe(4);
    expect(result.ratio).toBe(1);
  });

  it('should get cube analysis', () => {
    // Given - valid cube

    // When
    const result = service.getCubeAnalysis(cube);

    // Then
    expect(result.surfaceArea).toBe(24);
    expect(result.volume).toBe(8);
    expect(result.isValid).toBe(true);
    expect(result.baseOnPlanes.onXY).toBe(false);
    expect(result.vertices).toHaveLength(8);
  });
});
