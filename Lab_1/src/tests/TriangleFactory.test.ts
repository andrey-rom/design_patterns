import { TriangleFactory } from '../factories/TriangleFactory';
import { Triangle } from '../entities/Triangle';
import { InvalidTriangleException, ValidationException } from '../exceptions/GeometryExceptions';

describe('TriangleFactory', () => {
  let factory: TriangleFactory;

  beforeEach(() => {
    factory = new TriangleFactory();
  });

  it('should create valid triangle from correct data array', () => {
    // Given - coordinates for triangle
    const data = ['0', '0', '3', '0', '0', '4'];
    const id = 'test-triangle';

    // When
    const triangle = factory.createShape(id, data);

    // Then
    expect(triangle).toBeInstanceOf(Triangle);
    expect(triangle.id).toBe(id);
    expect(triangle.pointA.x).toBe(0);
    expect(triangle.pointB.x).toBe(3);
    expect(triangle.pointC.y).toBe(4);
  });

  it('should throw ValidationException for insufficient data', () => {
    // Given - insufficient coordinates
    const data = ['0', '0', '1', '0'];
    const id = 'invalid-triangle';

    // When & Then
    expect(() => factory.createShape(id, data)).toThrow(ValidationException);
    expect(() => factory.createShape(id, data)).toThrow('Triangle requires 6 coordinates');
  });

  it('should throw InvalidTriangleException for collinear points', () => {
    // Given - collinear points
    const data = ['0', '0', '1', '1', '2', '2'];
    const id = 'collinear-triangle';

    // When & Then
    expect(() => factory.createShape(id, data)).toThrow(InvalidTriangleException);
    expect(() => factory.createShape(id, data)).toThrow('Points are collinear and do not form a triangle');
  });
});
