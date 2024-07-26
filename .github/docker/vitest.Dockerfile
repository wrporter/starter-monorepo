###############################################################################
# Prepare an image for a test runner, such as API tests.
###############################################################################

###############################################################################
# Image containing all built artifacts
###############################################################################
ARG BASE_IMAGE=base-image
FROM ${BASE_IMAGE} AS artifact

###############################################################################
# Base image
###############################################################################
FROM node:20-alpine AS base

WORKDIR /app
RUN apk update && apk upgrade --no-cache
RUN npm config set update-notifier false

ENV TURBO_TELEMETRY_DISABLED=1

###############################################################################
# Prune everything except what's necessary for the app
###############################################################################
FROM base AS prune

# See https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

COPY --from=artifact /app .

ARG APP

RUN npx turbo prune ${APP} --docker

WORKDIR /app/out/json

# TODO: Because we have some packages with production dependencies (e.g.
# eslint-config), those get recognized as production dependencies in the final
# docker image, more than doubling the size of the image. Turbo plans to
# account for this and it's not done yet.
# One way to get around this is to move the packages with heavy production
# dependencies out of this monorepo and publish them.
# See https://github.com/vercel/turbo/issues/1100
RUN npm prune --omit=dev

###############################################################################
# Production image
###############################################################################
FROM base AS production

COPY --from=prune /app/node_modules* ./node_modules
# TODO: Optimize the package copy to only copy package.json and dist.
COPY --from=prune /app/out/full/packages* ./packages

ARG APP

WORKDIR /app/apps/${APP}

COPY --from=prune /app/apps/${APP}/ ./

CMD ["npx", "vitest", "run"]
