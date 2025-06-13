// Jest test setup file
// Add any global test configurations here

// Set up test environment
process.env.NODE_ENV = 'test';

// Mock logger for tests if needed
const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

jest.mock('../utils/logger', () => ({
  logger: mockLogger,
  default: mockLogger,
}));
