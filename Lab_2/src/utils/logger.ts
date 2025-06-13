/* eslint-disable @typescript-eslint/no-explicit-any */
import pino from 'pino';
import { FILE_PATHS } from '../constants';

interface NoopLogger {
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  child: () => NoopLogger;
}

const isTestEnvironment = process.env.NODE_ENV === 'test';

const createLogger = (): pino.Logger | NoopLogger => {
  if (isTestEnvironment) {
    const noopLogger: NoopLogger = {
      info: (): void => {},
      warn: (): void => {},
      error: (): void => {},
      debug: (): void => {},
      child: (): NoopLogger => noopLogger,
    };
    return noopLogger;
  }

  const targets = [
    {
      target: 'pino/file',
      options: {
        destination: FILE_PATHS.LOGS,
        mkdir: true,
      },
      level: 'info',
    },
    {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
        ignore: 'pid,hostname',
      },
      level: 'info',
    } as pino.TransportTargetOptions,
  ];

  const transport = pino.transport({ targets });

  return pino(
    {
      level: 'info',
      timestamp: pino.stdTimeFunctions.isoTime,
    },
    transport,
  );
};

const logger = createLogger();

export default logger;
