export const VALIDATION_PATTERNS = {
  NUMBER: /^-?\d+(\.\d+)?$/,
  POSITIVE_NUMBER: /^\d+(\.\d+)?$/,
  COORDINATE: /^-?\d+(\.\d+)?$/,
};

export const PRECISION = 1e-10;

export const FILE_PATHS = {
  TRIANGLE_DATA: 'data/triangles.txt',
  CUBE_DATA: 'data/cubes.txt',
  LOGS: 'logs/application.log',
};

export const SHAPE_TYPES = {
  TRIANGLE: 'triangle',
  CUBE: 'cube',
};

export const TRIANGLE_TYPES = {
  EQUILATERAL: 'equilateral',
  ISOSCELES: 'isosceles',
  SCALENE: 'scalene',
  RIGHT: 'right',
  ACUTE: 'acute',
  OBTUSE: 'obtuse',
};
