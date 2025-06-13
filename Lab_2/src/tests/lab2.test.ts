import { ShapeRepository } from '../repositories/ShapeRepository';
import { Warehouse } from '../warehouse/Warehouse';
import { WarehouseObserver } from '../observers/WarehouseObserver';
import { Triangle } from '../entities/Triangle';
import { Cube } from '../entities/Cube';
import { Point2D } from '../entities/Point2D';
import { Point3D } from '../entities/Point3D';

// Specifications
import {
  IdSpecification,
  NameSpecification,
  FirstQuadrantSpecification,
  AreaRangeSpecification,
  VolumeRangeSpecification,
} from '../specifications/ShapeSpecifications';

// Comparators
import {
  IdComparator, NameComparator, AreaComparator, VolumeComparator,
} from '../comparators/ShapeComparators';

describe('Lab2', () => {
  let repository: ShapeRepository;
  let warehouse: Warehouse;
  let triangle1: Triangle;
  let triangle2: Triangle;
  let cube1: Cube;
  let cube2: Cube;

  beforeEach(() => {
    repository = new ShapeRepository();
    warehouse = Warehouse.getInstance();

    // Clear repository before each test
    repository.clear();

    // Create test shapes
    triangle1 = new Triangle('triangle_1', new Point2D(0, 0), new Point2D(3, 0), new Point2D(0, 4));
    triangle2 = new Triangle('triangle_2', new Point2D(1, 1), new Point2D(4, 1), new Point2D(2.5, 3));
    cube1 = new Cube('cube_1', new Point3D(0, 0, 0), 2);
    cube2 = new Cube('cube_2', new Point3D(3, 3, 3), 1.5);
  });

  describe('Repository Pattern', () => {
    test('should add shapes to repository', () => {
      // Given
      const initialCount = repository.count();

      // When
      repository.add(triangle1);

      // Then
      expect(repository.count()).toBe(initialCount + 1);
      expect(repository.exists('triangle_1')).toBe(true);
    });

    test('should find shape by id', () => {
      // Given
      repository.add(triangle1);

      // When
      const foundShape = repository.findById('triangle_1');

      // Then
      expect(foundShape).toBe(triangle1);
    });

    test('should remove shape from repository', () => {
      // Given
      repository.add(triangle1);
      repository.add(cube1);

      // When
      const removeResult = repository.remove('triangle_1');

      // Then
      expect(removeResult).toBe(true);
      expect(repository.count()).toBe(1);
      expect(repository.findById('triangle_1')).toBeUndefined();
    });

    test('should return false when removing non-existent shape', () => {
      // Given
      // Empty repository

      // When
      const removeResult = repository.remove('nonexistent');

      // Then
      expect(removeResult).toBe(false);
    });

    test('should find all shapes', () => {
      // Given
      repository.add(triangle1);
      repository.add(triangle2);
      repository.add(cube1);

      // When
      const allShapes = repository.findAll();

      // Then
      expect(allShapes).toHaveLength(3);
      expect(allShapes).toContain(triangle1);
      expect(allShapes).toContain(triangle2);
      expect(allShapes).toContain(cube1);
    });
  });

  describe('Singleton Pattern (Warehouse)', () => {
    test('should return same instance', () => {
      // Given
      // No preconditions

      // When
      const warehouse1 = Warehouse.getInstance();
      const warehouse2 = Warehouse.getInstance();

      // Then
      expect(warehouse1).toBe(warehouse2);
    });
  });

  describe('Observer Pattern', () => {
    test('should create warehouse observer', () => {
      // Given
      // No preconditions

      // When
      const observer = new WarehouseObserver();

      // Then
      expect(observer).toBeInstanceOf(WarehouseObserver);
    });

    test('should update warehouse when triangle is modified', () => {
      // Given
      repository.add(triangle1);
      const initialMetrics = warehouse.getMetrics(triangle1.id);

      // When
      triangle1.updatePoints(new Point2D(0, 0), new Point2D(6, 0), new Point2D(0, 8));

      // Then
      const updatedMetrics = warehouse.getMetrics(triangle1.id);
      expect(updatedMetrics).toBeDefined();
      expect(updatedMetrics!.area).toBe(24); // 0.5 * 6 * 8 = 24
      expect(updatedMetrics!.area).not.toBe(initialMetrics!.area);
    });

    test('should update warehouse when cube is modified', () => {
      // Given
      repository.add(cube1);
      const initialMetrics = warehouse.getMetrics(cube1.id);

      // When
      cube1.updateCube(new Point3D(0, 0, 0), 3);

      // Then
      const updatedMetrics = warehouse.getMetrics(cube1.id);
      expect(updatedMetrics).toBeDefined();
      expect(updatedMetrics!.volume).toBe(27); // 3^3 = 27
      expect(updatedMetrics!.volume).not.toBe(initialMetrics!.volume);
    });
  });

  describe('Specification Pattern', () => {
    beforeEach(() => {
      repository.add(triangle1);
      repository.add(triangle2);
      repository.add(cube1);
      repository.add(cube2);
    });

    test('should find by ID specification', () => {
      // Given
      const spec = new IdSpecification('triangle_1');

      // When
      const results = repository.findBySpecification(spec);

      // Then
      expect(results).toHaveLength(1);
      expect(results[0]).toBe(triangle1);
    });

    test('should find by name specification', () => {
      // Given
      const spec = new NameSpecification('Triangle');

      // When
      const results = repository.findBySpecification(spec);

      // Then
      expect(results).toHaveLength(2);
      expect(results).toContain(triangle1);
      expect(results).toContain(triangle2);
    });

    test('should find by first quadrant specification', () => {
      // Given
      const spec = new FirstQuadrantSpecification();

      // When
      const results = repository.findBySpecification(spec);

      // Then
      expect(results).toHaveLength(2);
      expect(results.map((s) => s.id)).toContain('triangle_2');
      expect(results.map((s) => s.id)).toContain('cube_2');
    });

    test('should find by area range specification', () => {
      // Given
      const spec = new AreaRangeSpecification(5, 15);

      // When
      const results = repository.findBySpecification(spec);

      // Then
      expect(results.length).toBeGreaterThan(0);
    });

    test('should find by volume range specification', () => {
      // Given
      const spec = new VolumeRangeSpecification(5, 15);

      // When
      const results = repository.findBySpecification(spec);

      // Then
      const cubeResults = results.filter((s) => s instanceof Cube);
      expect(cubeResults.length).toBeGreaterThan(0);
    });
  });

  describe('Comparator Pattern', () => {
    beforeEach(() => {
      repository.add(triangle1);
      repository.add(triangle2);
      repository.add(cube1);
      repository.add(cube2);
    });

    test('should sort by ID', () => {
      // Given
      const comparator = new IdComparator();

      // When
      const sorted = repository.sort(comparator);

      // Then
      expect(sorted.length).toBe(4);
      expect(sorted[0]?.id).toBe('cube_1');
      expect(sorted[1]?.id).toBe('cube_2');
      expect(sorted[2]?.id).toBe('triangle_1');
      expect(sorted[3]?.id).toBe('triangle_2');
    });

    test('should sort by name', () => {
      // Given
      const comparator = new NameComparator();

      // When
      const sorted = repository.sort(comparator);

      // Then
      expect(sorted.slice(0, 2).every((s) => s instanceof Cube)).toBe(true);
      expect(sorted.slice(2, 4).every((s) => s instanceof Triangle)).toBe(true);
    });

    test('should sort by area', () => {
      // Given
      const comparator = new AreaComparator();

      // When
      const sorted = repository.sort(comparator);

      // Then
      for (let i = 1; i < sorted.length; i++) {
        const prevArea = sorted[i - 1]?.getArea();
        const currArea = sorted[i]?.getArea();
        if (prevArea !== undefined && currArea !== undefined) {
          expect(prevArea).toBeLessThanOrEqual(currArea);
        }
      }
    });

    test('should sort by volume', () => {
      // Given
      const comparator = new VolumeComparator();

      // When
      const sorted = repository.sort(comparator);

      // Then
      const cubes = sorted.filter((s) => s instanceof Cube);
      const triangles = sorted.filter((s) => s instanceof Triangle);
      expect(cubes.length).toBe(2);
      expect(triangles.length).toBe(2);
    });
  });

  describe('Warehouse Operations', () => {
    beforeEach(() => {
      repository.add(triangle1);
      repository.add(triangle2);
      repository.add(cube1);
      repository.add(cube2);
    });

    test('should find shapes by area range', () => {
      // Given
      const minArea = 5;
      const maxArea = 25;

      // When
      const shapeIds = warehouse.getShapesByAreaRange(minArea, maxArea);

      // Then
      expect(shapeIds.length).toBeGreaterThan(0);
    });

    test('should find shapes by volume range', () => {
      // Given
      const minVolume = 5;
      const maxVolume = 15;

      // When
      const shapeIds = warehouse.getShapesByVolumeRange(minVolume, maxVolume);

      // Then
      expect(shapeIds.length).toBeGreaterThan(0);
      const shapes = repository.getShapesByIds(shapeIds);
      expect(shapes.every((s) => s instanceof Cube)).toBe(true);
    });

    test('should find shapes by perimeter range', () => {
      // Given
      const minPerimeter = 10;
      const maxPerimeter = 50;

      // When
      const shapeIds = warehouse.getShapesByPerimeterRange(minPerimeter, maxPerimeter);

      // Then
      expect(shapeIds.length).toBeGreaterThan(0);
    });

    test('should get all metrics', () => {
      // Given
      // Shapes already added in beforeEach

      // When
      const allMetrics = warehouse.getAllMetrics();

      // Then
      expect(allMetrics.size).toBe(4);
      expect(allMetrics.has(triangle1.id)).toBe(true);
      expect(allMetrics.has(cube1.id)).toBe(true);
    });

    test('should remove metrics', () => {
      // Given
      const initialMetrics = warehouse.getMetrics(triangle1.id);
      expect(initialMetrics).toBeDefined();

      // When
      warehouse.removeMetrics(triangle1.id);

      // Then
      const removedMetrics = warehouse.getMetrics(triangle1.id);
      expect(removedMetrics).toBeUndefined();
    });

    test('should update metrics directly', () => {
      // Given
      const initialMetrics = warehouse.getMetrics(triangle1.id);

      // When
      warehouse.updateMetrics(triangle1);

      // Then
      const updatedMetrics = warehouse.getMetrics(triangle1.id);
      expect(updatedMetrics).toBeDefined();
      expect(updatedMetrics!.area).toBe(6);
      expect(updatedMetrics!.perimeter).toBeGreaterThan(0);
      expect(updatedMetrics!.area).toBe(initialMetrics!.area);
    });

    test('should handle volume metrics for 3D shapes', () => {
      // Given
      // cube1 already added in beforeEach

      // When
      const cubeMetrics = warehouse.getMetrics(cube1.id);

      // Then
      expect(cubeMetrics).toBeDefined();
      expect(cubeMetrics!.volume).toBeDefined();
      expect(cubeMetrics!.volume).toBe(8);
    });

    test('should handle non-existent shape metrics', () => {
      // Given
      const nonExistentId = 'non-existent';

      // When
      const nonExistentMetrics = warehouse.getMetrics(nonExistentId);

      // Then
      expect(nonExistentMetrics).toBeUndefined();
    });
  });

  describe('Repository Statistics', () => {
    test('should provide correct count', () => {
      // Given
      repository.add(triangle1);
      repository.add(triangle2);
      repository.add(cube1);
      repository.add(cube2);

      // When
      const count = repository.count();

      // Then
      expect(count).toBe(4);
      expect(repository.findAll().length).toBe(4);
    });
  });
});
