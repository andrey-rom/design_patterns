export interface IValidator<T> {
  validate(data: T): boolean;
  getValidationErrors(data: T): string[];
}
