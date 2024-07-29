import fastify from 'fastify';

import { meta } from './meta.plugin.js';

const app = fastify();
app.register(meta);
afterAll(() => app.close());

describe('Health route', () => {
  it('configures a simple health route', async () => {
    app.status = 'ok';

    const response = await app.inject({
      method: 'GET',
      url: '/healthcheck',
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual({ status: 'ok' });
  });
});

describe('Version route', () => {
  const versionMeta = {
    id: 'testApp',
    branch: 'testBranch',
    sha: '12345',
    version: '1.0.2',
    buildDate: '2022-07-05',
  };

  const { env } = process;
  beforeEach(() => {
    process.env = { ...env };
  });
  afterEach(() => {
    process.env = env;
  });

  // TODO: Setting env variables isn't respected for some reason.
  it.skip('falls back to the version info from environment variables', async () => {
    process.env.APP_ID = versionMeta.id;
    process.env.BUILD_BRANCH = versionMeta.branch;
    process.env.BUILD_SHA = versionMeta.sha;
    process.env.BUILD_VERSION = versionMeta.version;
    process.env.BUILD_DATE = versionMeta.buildDate;

    const response = await app.inject({
      method: 'GET',
      url: '/version',
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual(versionMeta);
  });

  it('returns the metadata defaulted to empty strings', async () => {
    delete process.env.APP_ID;
    delete process.env.BUILD_BRANCH;
    delete process.env.BUILD_SHA;
    delete process.env.BUILD_VERSION;
    delete process.env.BUILD_DATE;

    const response = await app.inject({
      method: 'GET',
      url: '/version',
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual({
      id: '',
      branch: '',
      sha: '',
      version: '',
      buildDate: '',
    });
  });
});
