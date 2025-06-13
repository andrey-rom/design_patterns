import { Cube } from '../entities/Cube';
import { Point3D } from '../entities/Point3D';

describe('Cube', () => {
  let center: Point3D;
  let cube: Cube;

  beforeEach(() => {
    center = new Point3D(0, 0, 0);
    cube = new Cube('test-cube', center, 2);
  });

  describe('constructor', () => {
    it('should create cube with given center point and side length', () => {
      // Given - center and side length already set in beforeEach

      // When - cube already created in beforeEach

      // Then
      expect(cube.id).toBe('test-cube');
      expect(cube.center).toBe(center);
      expect(cube.sideLength).toBe(2);
      expect(cube.name).toBe('Cube');
      expect(cube).toBeInstanceOf(Cube);
    });

    it('should create cube with custom name', () => {
      // Given
      const customName = 'MyCube';
      const customCenter = new Point3D(1, 2, 3);
      const customSideLength = 5;

      // When
      const namedCube = new Cube('custom-id', customCenter, customSideLength, customName);

      // Then
      expect(namedCube.name).toBe(customName);
      expect(namedCube.id).toBe('custom-id');
      expect(namedCube.center).toBe(customCenter);
      expect(namedCube.sideLength).toBe(customSideLength);
    });
  });

  describe('sideLength property', () => {
    it('should have correct side length', () => {
      // Given - cube with side length 2

      // When
      const { sideLength } = cube;

      // Then
      expect(sideLength).toBe(2);
      expect(sideLength).toBeGreaterThan(0);
      expect(typeof sideLength).toBe('number');
      expect(Number.isFinite(sideLength)).toBe(true);
      expect(sideLength).toBeCloseTo(2, 10);
    });

    it('should support decimal side length', () => {
      // Given
      const decimalCube = new Cube('decimal', new Point3D(0, 0, 0), 2.5);

      // When
      const { sideLength } = decimalCube;

      // Then
      expect(sideLength).toBe(2.5);
      expect(sideLength).toBeCloseTo(2.5, 10);
      expect(sideLength).toBeGreaterThan(2);
      expect(sideLength).toBeLessThan(3);
    });
  });

  describe('isValid - является ли объект кубом', () => {
    it('should return true for valid cube with positive side length', () => {
      // Given - cube with positive side length

      // When
      const isValid = cube.isValid();

      // Then
      expect(isValid).toBe(true);
      expect(isValid).toBeTruthy();
      expect(typeof isValid).toBe('boolean');
      expect(isValid).not.toBe(false);
    });

    it('should return false for cube with zero side length', () => {
      // Given
      const invalidCube = new Cube('invalid', new Point3D(0, 0, 0), 0);

      // When
      const isValid = invalidCube.isValid();

      // Then
      expect(isValid).toBe(false);
      expect(isValid).toBeFalsy();
      expect(isValid).not.toBeTruthy();
      expect(typeof isValid).toBe('boolean');
    });

    it('should return false for cube with negative side length', () => {
      // Given
      const negativeCube = new Cube('negative', new Point3D(0, 0, 0), -5);

      // When
      const isValid = negativeCube.isValid();

      // Then
      expect(isValid).toBe(false);
      expect(isValid).toBeFalsy();
      expect(isValid).not.toBe(true);
      expect(typeof isValid).toBe('boolean');
    });
  });

  describe('center property', () => {
    it('should have correct center coordinates', () => {
      // Given - cube with center at (0,0,0)

      // When
      const cubeCenter = cube.center;

      // Then
      expect(cubeCenter.x).toBe(0);
      expect(cubeCenter.y).toBe(0);
      expect(cubeCenter.z).toBe(0);
      expect(cubeCenter).toBeInstanceOf(Point3D);
      expect(typeof cubeCenter.x).toBe('number');
    });
  });

  describe('toString', () => {
    it('should return correct string representation with ID', () => {
      // Given - cube from beforeEach

      // When
      const result = cube.toString();

      // Then
      expect(result).toContain('Cube');
      expect(result).toContain('test-cube');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).not.toBeNull();
    });

    it('should include ID in string representation', () => {
      // Given
      const largeCube = new Cube('large', new Point3D(1, 2, 3), 10);

      // When
      const result = largeCube.toString();

      // Then
      expect(result).toContain('Cube');
      expect(result).toContain('large');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
