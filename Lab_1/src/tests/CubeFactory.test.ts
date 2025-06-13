import { CubeFactory } from '../factories/CubeFactory';
import { Cube } from '../entities/Cube';
import { ValidationException } from '../exceptions/GeometryExceptions';

describe('CubeFactory', () => {
  let factory: CubeFactory;

  beforeEach(() => {
    factory = new CubeFactory();
  });

  it('should create valid cube from correct data array', () => {
    // Given
    const data = ['0', '0', '0', '2'];
    const id = 'test-cube';

    // When
    const cube = factory.createShape(id, data);

    // Then
    expect(cube).toBeInstanceOf(Cube);
    expect(cube.id).toBe(id);
    expect(cube.sideLength).toBe(2);
  });

  it('should throw ValidationException for insufficient data', () => {
    // Given
    const data = ['0', '0', '0'];
    const id = 'invalid-cube';

    // When & Then
    expect(() => factory.createShape(id, data)).toThrow(ValidationException);
  });

  it('should throw ValidationException for negative side length', () => {
    // Given
    const data = ['0', '0', '0', '-5'];
    const id = 'negative-cube';

    // When & Then
    expect(() => factory.createShape(id, data)).toThrow(ValidationException);
  });
});
