import { Point3D } from '../entities/Point3D';

describe('Point3D', () => {
  it('should create point with valid coordinates', () => {
    // Given - coordinates
    const x = 5.5;
    const y = -3.2;
    const z = 7.8;

    // When
    const point = new Point3D(x, y, z);

    // Then
    expect(point.x).toBe(x);
    expect(point.y).toBe(y);
    expect(point.z).toBe(z);
  });

  it('should return true for identical points', () => {
    // Given - two identical points
    const point1 = new Point3D(3.14, 2.71, 1.41);
    const point2 = new Point3D(3.14, 2.71, 1.41);

    // When
    const result = point1.equals(point2);

    // Then
    expect(result).toBe(true);
  });

  it('should return false for different points', () => {
    // Given - two different points
    const point1 = new Point3D(1, 2, 3);
    const point2 = new Point3D(4, 5, 6);

    // When
    const result = point1.equals(point2);

    // Then
    expect(result).toBe(false);
  });

  it('should return correct string representation', () => {
    // Given - point with coordinates
    const point = new Point3D(3.14, -2.71, 1.41);

    // When
    const result = point.toString();

    // Then
    expect(result).toBe('Point3D(3.14, -2.71, 1.41)');
  });
});
