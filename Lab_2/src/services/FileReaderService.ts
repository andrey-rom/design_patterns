import * as fs from 'fs';
import * as path from 'path';
import { FileProcessingException } from '../exceptions/GeometryExceptions';

export class FileReaderService {
  public readFile(filePath: string): string[] {
    try {
      const absolutePath = path.resolve(filePath);

      if (!fs.existsSync(absolutePath)) {
        throw new FileProcessingException(`File not found: ${filePath}`);
      }

      const fileContent = fs.readFileSync(absolutePath, 'utf-8');
      const lines = fileContent.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);

      return lines;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new FileProcessingException(`Failed to read file ${filePath}: ${errorMessage}`);
    }
  }

  public validateFileExists(filePath: string): boolean {
    try {
      const absolutePath = path.resolve(filePath);
      return fs.existsSync(absolutePath);
    } catch (error) {
      return false;
    }
  }
}
