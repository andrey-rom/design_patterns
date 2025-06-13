import { TriangleService } from '../services/TriangleService';
import { Triangle } from '../entities/Triangle';
import { Point2D } from '../entities/Point2D';

describe('TriangleService', () => {
  let service: TriangleService;
  let triangle: Triangle;

  beforeEach(() => {
    service = new TriangleService();
    triangle = new Triangle('test', new Point2D(0, 0), new Point2D(3, 0), new Point2D(0, 4));
  });

  it('should calculate area', () => {
    // Given - right triangle with base 3, height 4

    // When
    const result = service.calculateArea(triangle);

    // Then
    expect(result).toBe(6);
  });

  it('should calculate perimeter', () => {
    // Given - triangle with sides 3, 4, 5

    // When
    const result = service.calculatePerimeter(triangle);

    // Then
    expect(result).toBe(12);
  });

  it('should validate triangle points', () => {
    // Given - valid triangle points
    const pointA = new Point2D(0, 0);
    const pointB = new Point2D(1, 0);
    const pointC = new Point2D(0, 1);

    // When
    const result = service.isTriangleValid(pointA, pointB, pointC);

    // Then
    expect(result).toBe(true);
  });

  it('should check if triangle is right', () => {
    // Given - 3-4-5 right triangle

    // When
    const result = service.isRightTriangle(triangle);

    // Then
    expect(result).toBe(true);
  });

  it('should check if triangle is isosceles', () => {
    // Given - triangle

    // When
    const result = service.isIsoscelesTriangle(triangle);

    // Then
    expect(result).toBe(false);
  });

  it('should check if triangle is equilateral', () => {
    // Given - triangle

    // When
    const result = service.isEquilateralTriangle(triangle);

    // Then
    expect(result).toBe(false);
  });

  it('should get triangle type', () => {
    // Given - scalene triangle

    // When
    const result = service.getTriangleType(triangle);

    // Then
    expect(result).toBe('scalene');
  });

  it('should get angle type', () => {
    // Given - right triangle

    // When
    const result = service.getAngleType(triangle);

    // Then
    expect(result).toBe('right');
  });

  it('should get triangle analysis', () => {
    // Given - triangle

    // When
    const result = service.getTriangleAnalysis(triangle);

    // Then
    expect(result.area).toBe(6);
    expect(result.perimeter).toBe(12);
    expect(result.type).toBe('scalene');
    expect(result.angleType).toBe('right');
    expect(result.isValid).toBe(true);
  });
});
