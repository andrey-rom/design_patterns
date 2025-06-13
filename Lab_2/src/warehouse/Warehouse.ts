import { Shape } from '../entities/Shape';

export interface ShapeMetrics {
  area: number;
  perimeter: number;
  volume?: number;
}

export class Warehouse {
  private static instance: Warehouse;

  private metrics: Map<string, ShapeMetrics> = new Map();

  private constructor() {}

  public static getInstance(): Warehouse {
    if (!Warehouse.instance) {
      Warehouse.instance = new Warehouse();
    }
    return Warehouse.instance;
  }

  public updateMetrics(shape: Shape): void {
    const metrics: ShapeMetrics = {
      area: shape.getArea(),
      perimeter: shape.getPerimeter(),
    };

    if (shape.getVolume) {
      metrics.volume = shape.getVolume();
    }

    this.metrics.set(shape.id, metrics);
  }

  public getMetrics(shapeId: string): ShapeMetrics | undefined {
    return this.metrics.get(shapeId);
  }

  public getAllMetrics(): Map<string, ShapeMetrics> {
    return new Map(this.metrics);
  }

  public removeMetrics(shapeId: string): void {
    this.metrics.delete(shapeId);
  }

  public getShapesByAreaRange(minArea: number, maxArea: number): string[] {
    const result: string[] = [];
    for (const [shapeId, metrics] of this.metrics.entries()) {
      if (metrics.area >= minArea && metrics.area <= maxArea) {
        result.push(shapeId);
      }
    }
    return result;
  }

  public getShapesByVolumeRange(minVolume: number, maxVolume: number): string[] {
    const result: string[] = [];
    for (const [shapeId, metrics] of this.metrics.entries()) {
      if (metrics.volume !== undefined && metrics.volume >= minVolume && metrics.volume <= maxVolume) {
        result.push(shapeId);
      }
    }
    return result;
  }

  public getShapesByPerimeterRange(minPerimeter: number, maxPerimeter: number): string[] {
    const result: string[] = [];
    for (const [shapeId, metrics] of this.metrics.entries()) {
      if (metrics.perimeter >= minPerimeter && metrics.perimeter <= maxPerimeter) {
        result.push(shapeId);
      }
    }
    return result;
  }
}
