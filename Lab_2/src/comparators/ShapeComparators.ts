import { Shape } from '../entities/Shape';
import { ShapeComparator } from '../interfaces/ShapeComparator';

export class IdComparator implements ShapeComparator {
  compare(a: Shape, b: Shape): number {
    return a.id.localeCompare(b.id);
  }
}

export class NameComparator implements ShapeComparator {
  compare(a: Shape, b: Shape): number {
    return a.getName().localeCompare(b.getName());
  }
}

export class XCoordinateComparator implements ShapeComparator {
  compare(a: Shape, b: Shape): number {
    const aPoint = a.getFirstPoint();
    const bPoint = b.getFirstPoint();
    return aPoint.x - bPoint.x;
  }
}

export class YCoordinateComparator implements ShapeComparator {
  compare(a: Shape, b: Shape): number {
    const aPoint = a.getFirstPoint();
    const bPoint = b.getFirstPoint();
    return aPoint.y - bPoint.y;
  }
}

export class ZCoordinateComparator implements ShapeComparator {
  compare(a: Shape, b: Shape): number {
    const aPoint = a.getFirstPoint();
    const bPoint = b.getFirstPoint();
    const aZ = aPoint.z || 0;
    const bZ = bPoint.z || 0;
    return aZ - bZ;
  }
}

export class AreaComparator implements ShapeComparator {
  compare(a: Shape, b: Shape): number {
    return a.getArea() - b.getArea();
  }
}

export class PerimeterComparator implements ShapeComparator {
  compare(a: Shape, b: Shape): number {
    return a.getPerimeter() - b.getPerimeter();
  }
}

export class VolumeComparator implements ShapeComparator {
  compare(a: Shape, b: Shape): number {
    const aVolume = a.getVolume?.() || 0;
    const bVolume = b.getVolume?.() || 0;
    return aVolume - bVolume;
  }
}

export class DistanceFromOriginComparator implements ShapeComparator {
  compare(a: Shape, b: Shape): number {
    const aPoint = a.getFirstPoint();
    const bPoint = b.getFirstPoint();

    const aDistance = Math.sqrt(aPoint.x ** 2 + aPoint.y ** 2 + (aPoint.z || 0) ** 2);
    const bDistance = Math.sqrt(bPoint.x ** 2 + bPoint.y ** 2 + (bPoint.z || 0) ** 2);

    return aDistance - bDistance;
  }
}
