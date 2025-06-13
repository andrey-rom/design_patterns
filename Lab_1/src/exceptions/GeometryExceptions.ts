export class GeometryException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeometryException';
  }
}

export class InvalidPointException extends GeometryException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPointException';
  }
}

export class InvalidShapeException extends GeometryException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidShapeException';
  }
}

export class ValidationException extends GeometryException {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
  }
}

export class FileProcessingException extends GeometryException {
  constructor(message: string) {
    super(message);
    this.name = 'FileProcessingException';
  }
}

export class InvalidTriangleException extends InvalidShapeException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTriangleException';
  }
}

export class InvalidCubeException extends InvalidShapeException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCubeException';
  }
}
