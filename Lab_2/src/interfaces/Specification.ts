import { Shape } from '../entities/Shape';

export interface Specification<T> {
  isSatisfiedBy(item: T): boolean;
}

export interface ShapeSpecification extends Specification<Shape> {}
