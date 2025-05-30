// Basic logger setup (can be expanded with Winston or Pino later)

const getTimestamp = (): string => new Date().toISOString();

export const logger = {
  info: (message: string, ...optionalParams: unknown[]) => {
    console.log(`[${getTimestamp()}] [INFO] ${message}`, ...optionalParams);
  },
  warn: (message: string, ...optionalParams: unknown[]) => {
    console.warn(`[${getTimestamp()}] [WARN] ${message}`, ...optionalParams);
  },
  error: (message: string, error?: Error | unknown, ...optionalParams: unknown[]) => {
    const errorDetails = error instanceof Error ? error : '';
    console.error(`[${getTimestamp()}] [ERROR] ${message}`, errorDetails, ...optionalParams);
  },
  debug: (message: string, ...optionalParams: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[${getTimestamp()}] [DEBUG] ${message}`, ...optionalParams);
    }
  },
};