import { Shape } from '../entities/Shape';

export interface ShapeComparator {
  compare(a: Shape, b: Shape): number;
}
