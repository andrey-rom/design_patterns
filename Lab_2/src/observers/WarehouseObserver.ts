import { Shape } from '../entities/Shape';
import { ShapeObserver } from '../interfaces/ShapeObserver';
import { Warehouse } from '../warehouse/Warehouse';

export class WarehouseObserver implements ShapeObserver {
  private warehouse: Warehouse;

  constructor() {
    this.warehouse = Warehouse.getInstance();
  }

  update(shape: Shape): void {
    this.warehouse.updateMetrics(shape);
  }
}
