export abstract class Shape {
  public readonly id: string;

  public readonly name: string;

  constructor(id: string, name?: string) {
    this.id = id;
    this.name = name || this.constructor.name;
  }

  public abstract getArea(): number;

  public abstract getPerimeter(): number | undefined;

  public abstract isValid(): boolean;

  public toString(): string {
    return `${this.name} (ID: ${this.id})`;
  }
}
