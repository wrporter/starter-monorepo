import { FastifyReply, FastifyRequest } from 'fastify';

/**
 * Service version information.
 *
 * If values are not provided, the following are taken from environment variables. Otherwise, the
 * values are empty strings.
 *
 * - **APP_ID:** The identifier for the service. Commonly matches the Nomad job ID.
 * - **BUILD_BRANCH:** The version control branch of the source code this build was created from.
 * - **BUILD_SHA:** The SHA1 hash of the source code this build was created from. For git repos,
 * this hash is conventionally the git commit.
 * - **BUILD_DATE:** The date this app was built in RFC3339 format.
 * - **BUILD_VERSION:** _[Optional]_ A semantic version of the app.
 */
export interface VersionMeta {
  /** The name of xthis service. */
  id?: string;
  /**
   * The version control branch of the source code this build was created from.
   */
  branch?: string;
  /**
   * The SHA1 hash of the source code this build was created from. For git repos, this hash is
   * conventionally the git commit.
   */
  sha?: string;
  /** The semantic version of the current build. */
  version?: string;
  /** The date this app was built in RFC3339 format. */
  buildDate?: string;
}

/**
 * Version route handler to provide version information about the currently running service. The
 * route expects the following environment variables.
 */
export function createVersionHandler(versionMeta?: VersionMeta) {
  const meta: VersionMeta = {
    id: process.env.APP_ID ?? '',
    branch: process.env.BUILD_BRANCH ?? '',
    sha: process.env.BUILD_SHA ?? '',
    version: process.env.BUILD_VERSION ?? '',
    buildDate: process.env.BUILD_DATE ?? '',
    ...versionMeta,
  };

  return (_: FastifyRequest, reply: FastifyReply) => {
    reply.send(meta);
  };
}
