import { createDefaultLogger, pickFieldsFromError } from './log.js';

const { env } = process;
beforeEach(() => {
  process.env = { ...env };
});
afterEach(() => {
  process.env = env;
});

it.each([
  { env: 'test', level: 'silent' },
  { env: 'development', level: 'debug' },
  { env: 'production', level: 'info' },
])('sets the level to $level in $env', ({ env, level }) => {
  process.env.NODE_ENV = env;

  const log = createDefaultLogger();

  expect(log.level).toBe(level);
});

it('picks specific fields from error objects to avoid logging sensitive data', () => {
  class PiiError extends Error {
    name = 'PiiError';
    constructor(public readonly email: string) {
      super('A failure occurred');
    }
  }

  const error = new PiiError('email@test.com');

  expect(pickFieldsFromError(error)).toEqual({
    name: 'PiiError',
    message: 'A failure occurred',
    stack: expect.any(String),
  });
});
