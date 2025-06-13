import { Triangle } from '../entities/Triangle';
import { Point2D } from '../entities/Point2D';

describe('Triangle', () => {
  let triangle: Triangle;

  beforeEach(() => {
    const pointA = new Point2D(0, 0);
    const pointB = new Point2D(3, 0);
    const pointC = new Point2D(0, 4);
    triangle = new Triangle('test-triangle', pointA, pointB, pointC);
  });

  it('should create triangle with given points', () => {
    // Given - points and id

    // When
    const result = triangle;

    // Then
    expect(result.id).toBe('test-triangle');
    expect(result.pointA.x).toBe(0);
    expect(result.pointB.x).toBe(3);
    expect(result.pointC.y).toBe(4);
  });

  it('should calculate area', () => {
    // Given - right triangle with base 3, height 4

    // When
    const result = triangle.getArea();

    // Then
    expect(result).toBe(6);
  });

  it('should calculate perimeter', () => {
    // Given - triangle with sides 3, 4, 5

    // When
    const result = triangle.getPerimeter();

    // Then
    expect(result).toBe(12);
  });

  it('should validate triangle', () => {
    // Given - valid triangle

    // When
    const result = triangle.isValid();

    // Then
    expect(result).toBe(true);
  });

  it('should return triangle sides', () => {
    // Given - triangle with known sides

    // When
    const result = triangle.getSides();

    // Then
    expect(result).toEqual([3, 5, 4]);
  });
});
