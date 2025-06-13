import { ShapeObserver } from '../interfaces/ShapeObserver';

export abstract class Shape {
  private static idCounter = 0;

  public readonly id: string;

  private observers: ShapeObserver[] = [];

  constructor(id?: string) {
    this.id = id || `shape_${Shape.idCounter++}`;
  }

  public addObserver(observer: ShapeObserver): void {
    this.observers.push(observer);
  }

  public removeObserver(observer: ShapeObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  protected notifyObservers(): void {
    this.observers.forEach((observer) => observer.update(this));
  }

  public abstract getName(): string;

  public abstract getArea(): number;

  public abstract getPerimeter(): number;

  public abstract getFirstPoint(): { x: number; y: number; z?: number };

  public getVolume?(): number;

  public toString(): string {
    return `${this.getName()} (ID: ${this.id})`;
  }
}
