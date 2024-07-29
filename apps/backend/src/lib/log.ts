import { LoggerOptions, pino, stdTimeFunctions } from 'pino';

/**
 * Custom log levels to remove ambiguity in the granularity that is provided by Pino's defaults.
 * Below are guidelines for when to use each level.
 *
 * - **Error:** When a failure occurred in an expected scenario, such as an HTTP request failing.
 * - **Warn:** When an undesirable path has been taken, but an error has not occurred, such as a
 * call to a deprecated procedure.
 * - **Access:** When an HTTP call was made to the receiving service and has finished.
 * - **Info:** When key performance indicator (KPI) events have occurred, such as a new resource has
 * been created.
 * - **Debug:** When verbose development information should be shown, such as additional metadata
 * on fields or information about various branches in code taken.
 */
const customLevels = {
  error: 50,
  warn: 40,
  access: 35,
  info: 30,
  debug: 20,
};

const colored = {
  default: 'white',
  error: 'red',
  warn: 'yellow',
  access: 'blue',
  info: 'green',
  debug: 'gray',
  message: 'cyan',
  greyMessage: 'gray',
};

const commonLoggerOptions: LoggerOptions = {
  customLevels,
  // Cannot use only custom levels because Fastify uses some of Pino's default levels, such as
  // trace.
  // useOnlyCustomLevels: true,
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: stdTimeFunctions.isoTime,
  messageKey: 'message',
  errorKey: 'error',
  // Remove hostname and pid from logs.
  base: null,
};

type Env = 'development' | 'production' | 'test';

/**
 * Pick specific fields from error objects. Some errors include more information than we should
 * log. For example, Postgres can log PII when attempting to create a new record with the same
 * unique index.
 */
export const pickFieldsFromError = ({ name, message, stack }: Error) => ({
  name,
  message,
  stack,
});

const envToLogger: { [key in Env]: LoggerOptions } = {
  development: {
    ...commonLoggerOptions,
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        customLevels: Object.entries(customLevels)
          .map(([key, value]) => `${key}:${value}`)
          .join(','),
        customColors: Object.entries(colored)
          .map(([key, value]) => `${key}:${value}`)
          .join(','),
        messageKey: 'message',
        errorKey: 'error',
        translateTime: 'yyyy-mm-dd HH:MM:ss.l',
      },
    },
  },
  production: {
    ...commonLoggerOptions,
    level: 'info',
    serializers: {
      error: pickFieldsFromError,
    },
  },
  test: {
    level: 'silent',
    enabled: false,
  },
};

/**
 * Default log instance. Logs are configured differently based on the environment specified in
 * `process.env.NODE_ENV`. When no environment is specified, the default is `development`.
 * - `development` - Logs are pretty-printed and include debug logs.
 * - `production` - Logs are JSON-formatted and include only specific error fields to avoid
 * sensitive information being logged. The level is set to `info`.
 * - `test` - Logs are disabled.
 */
export const log = createDefaultLogger();

/**
 * Creates a default logger instance.
 */
export function createDefaultLogger() {
  return pino(envToLogger[(process.env.NODE_ENV as Env) ?? 'development']);
}
