import { Shape } from '../entities/Shape';
import { ShapeSpecification } from '../interfaces/Specification';
import { Warehouse } from '../warehouse/Warehouse';

export class IdSpecification implements ShapeSpecification {
  constructor(private id: string) {}

  isSatisfiedBy(shape: Shape): boolean {
    return shape.id === this.id;
  }
}

export class NameSpecification implements ShapeSpecification {
  constructor(private name: string) {}

  isSatisfiedBy(shape: Shape): boolean {
    return shape.getName().toLowerCase().includes(this.name.toLowerCase());
  }
}

export class FirstQuadrantSpecification implements ShapeSpecification {
  isSatisfiedBy(shape: Shape): boolean {
    const point = shape.getFirstPoint();
    return point.x > 0 && point.y > 0;
  }
}

export class AreaRangeSpecification implements ShapeSpecification {
  constructor(private minArea: number, private maxArea: number) {}

  isSatisfiedBy(shape: Shape): boolean {
    const warehouse = Warehouse.getInstance();
    const metrics = warehouse.getMetrics(shape.id);
    return metrics ? metrics.area >= this.minArea && metrics.area <= this.maxArea : false;
  }
}

export class VolumeRangeSpecification implements ShapeSpecification {
  constructor(private minVolume: number, private maxVolume: number) {}

  isSatisfiedBy(shape: Shape): boolean {
    const warehouse = Warehouse.getInstance();
    const metrics = warehouse.getMetrics(shape.id);
    return metrics && metrics.volume !== undefined
      ? metrics.volume >= this.minVolume && metrics.volume <= this.maxVolume : false;
  }
}

export class PerimeterRangeSpecification implements ShapeSpecification {
  constructor(private minPerimeter: number, private maxPerimeter: number) {}

  isSatisfiedBy(shape: Shape): boolean {
    const warehouse = Warehouse.getInstance();
    const metrics = warehouse.getMetrics(shape.id);
    return metrics ? metrics.perimeter >= this.minPerimeter && metrics.perimeter <= this.maxPerimeter : false;
  }
}

export class DistanceFromOriginSpecification implements ShapeSpecification {
  constructor(private minDistance: number, private maxDistance: number) {}

  isSatisfiedBy(shape: Shape): boolean {
    const point = shape.getFirstPoint();
    const distance = Math.sqrt(point.x ** 2 + point.y ** 2 + (point.z || 0) ** 2);
    return distance >= this.minDistance && distance <= this.maxDistance;
  }
}
