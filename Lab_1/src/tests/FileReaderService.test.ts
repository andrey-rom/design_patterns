import * as fs from 'fs';
import * as path from 'path';
import { FileReaderService } from '../services/FileReaderService';
import { FileProcessingException } from '../exceptions/GeometryExceptions';

// Мок для fs
jest.mock('fs');
jest.mock('path');

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedPath = path as jest.Mocked<typeof path>;

describe('FileReaderService', () => {
  let service: FileReaderService;

  beforeEach(() => {
    service = new FileReaderService();
    jest.clearAllMocks();

    // Настройка дефолтного поведения path.resolve
    mockedPath.resolve.mockImplementation((filePath: string) => `/absolute/path/to/${filePath}`);
  });

  it('should read file content and return array of lines', () => {
    // Given - file with valid content
    const filePath = 'test.txt';
    const fileContent = 'line1\nline2\n\nline3\n';
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(fileContent);

    // When
    const result = service.readFile(filePath);

    // Then
    expect(result).toEqual(['line1', 'line2', 'line3']);
  });

  it('should throw FileProcessingException if file does not exist', () => {
    // Given - non-existing file
    const filePath = 'nonexistent.txt';
    mockedFs.existsSync.mockReturnValue(false);

    // When & Then
    expect(() => service.readFile(filePath)).toThrow(FileProcessingException);
    expect(() => service.readFile(filePath)).toThrow('File not found: nonexistent.txt');
  });

  it('should throw FileProcessingException if readFileSync throws error', () => {
    // Given - file read error
    const filePath = 'error.txt';
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockImplementation(() => {
      throw new Error('Permission denied');
    });

    // When & Then
    expect(() => service.readFile(filePath)).toThrow(FileProcessingException);
    expect(() => service.readFile(filePath)).toThrow('Failed to read file error.txt: Permission denied');
  });

  it('should return true for existing file', () => {
    // Given - existing file
    const filePath = 'existing.txt';
    mockedFs.existsSync.mockReturnValue(true);

    // When
    const result = service.validateFileExists(filePath);

    // Then
    expect(result).toBe(true);
  });

  it('should return false for non-existing file', () => {
    // Given - non-existing file
    const filePath = 'nonexistent.txt';
    mockedFs.existsSync.mockReturnValue(false);

    // When
    const result = service.validateFileExists(filePath);

    // Then
    expect(result).toBe(false);
  });
});
