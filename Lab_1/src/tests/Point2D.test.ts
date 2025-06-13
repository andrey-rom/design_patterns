import { Point2D } from '../entities/Point2D';

describe('Point2D', () => {
  it('should create point with valid coordinates', () => {
    // Given - coordinates
    const x = 5.5;
    const y = -3.2;

    // When
    const point = new Point2D(x, y);

    // Then
    expect(point.x).toBe(x);
    expect(point.y).toBe(y);
  });

  it('should return true for identical points', () => {
    // Given - two identical points
    const point1 = new Point2D(3.14, 2.71);
    const point2 = new Point2D(3.14, 2.71);

    // When
    const result = point1.equals(point2);

    // Then
    expect(result).toBe(true);
  });

  it('should return false for different points', () => {
    // Given - two different points
    const point1 = new Point2D(1, 2);
    const point2 = new Point2D(3, 4);

    // When
    const result = point1.equals(point2);

    // Then
    expect(result).toBe(false);
  });

  it('should return correct string representation', () => {
    // Given - point with coordinates
    const point = new Point2D(3.14, -2.71);

    // When
    const result = point.toString();

    // Then
    expect(result).toBe('Point2D(3.14, -2.71)');
  });
});
