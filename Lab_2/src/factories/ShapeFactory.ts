import { Shape } from '../entities/Shape';

export abstract class ShapeFactory {
  public abstract createShape(id: string, data: string[]): Shape;

  public createShapeFromString(id: string, dataString: string): Shape {
    const data = dataString.trim().split(/\s+/);
    return this.createShape(id, data);
  }
}
