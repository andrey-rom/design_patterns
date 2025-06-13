import { Shape } from '../entities/Shape';
import { ShapeSpecification } from '../interfaces/Specification';
import { ShapeComparator } from '../interfaces/ShapeComparator';
import { WarehouseObserver } from '../observers/WarehouseObserver';
import { Warehouse } from '../warehouse/Warehouse';

export class ShapeRepository {
  private shapes: Map<string, Shape> = new Map();

  private warehouseObserver: WarehouseObserver;

  private warehouse: Warehouse;

  constructor() {
    this.warehouseObserver = new WarehouseObserver();
    this.warehouse = Warehouse.getInstance();
  }

  public add(shape: Shape): void {
    shape.addObserver(this.warehouseObserver);
    this.shapes.set(shape.id, shape);
    this.warehouseObserver.update(shape);
  }

  public remove(shapeId: string): boolean {
    const shape = this.shapes.get(shapeId);
    if (shape) {
      shape.removeObserver(this.warehouseObserver);
      this.warehouse.removeMetrics(shapeId);
      this.shapes.delete(shapeId);
      return true;
    }
    return false;
  }

  public findById(id: string): Shape | undefined {
    return this.shapes.get(id);
  }

  public findAll(): Shape[] {
    return Array.from(this.shapes.values());
  }

  public findBySpecification(specification: ShapeSpecification): Shape[] {
    return this.findAll().filter((shape) => specification.isSatisfiedBy(shape));
  }

  public findMultipleBySpecifications(specifications: ShapeSpecification[]): Shape[] {
    return this.findAll().filter((shape) => specifications.every((spec) => spec.isSatisfiedBy(shape)));
  }

  public count(): number {
    return this.shapes.size;
  }

  public exists(shapeId: string): boolean {
    return this.shapes.has(shapeId);
  }

  public clear(): void {
    this.shapes.forEach((shape) => {
      shape.removeObserver(this.warehouseObserver);
    });

    this.shapes.clear();

    const allMetrics = this.warehouse.getAllMetrics();
    allMetrics.forEach((_, shapeId) => {
      this.warehouse.removeMetrics(shapeId);
    });
  }

  public sort(comparator: ShapeComparator): Shape[] {
    const shapes = this.findAll();
    return shapes.sort((a, b) => comparator.compare(a, b));
  }

  public getShapesByIds(ids: string[]): Shape[] {
    const result: Shape[] = [];
    for (const id of ids) {
      const shape = this.findById(id);
      if (shape) {
        result.push(shape);
      }
    }
    return result;
  }

  public update(shape: Shape): boolean {
    if (this.shapes.has(shape.id)) {
      this.shapes.set(shape.id, shape);
      return true;
    }
    return false;
  }
}
