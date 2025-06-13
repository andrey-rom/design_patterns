import { Shape } from '../entities/Shape';

export interface ShapeObserver {
  update(shape: Shape): void;
}
