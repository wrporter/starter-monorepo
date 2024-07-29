// TODO: Use Fastify decorators for this instead. See
// https://fastify.dev/docs/latest/Reference/Decorators/

export type Status = 'startup' | 'ok' | 'shutdown';

export let status: Status = 'startup';

export function setStatus(value: Status) {
  status = value;
}
