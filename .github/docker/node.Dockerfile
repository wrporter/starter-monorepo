###############################################################################
# Prepare a production-ready image for Node.js applications.
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
# We can also re-install dependencies after turbo pruning to install only what
# is necessary.
RUN npm ci --omit=dev --loglevel=warn
# For some reason, not all dev dependencies are pruned. This is a workaround.
RUN npm prune --omit=dev

###############################################################################
# Production image
###############################################################################
FROM base AS production

# Build version metadata
ARG APP_ID
ARG BUILD_BRANCH
ARG BUILD_SHA
ARG BUILD_VERSION
ARG BUILD_DATE
ENV APP_ID=$APP_ID
ENV BUILD_BRANCH=$BUILD_BRANCH
ENV BUILD_SHA=$BUILD_SHA
ENV BUILD_VERSION=$BUILD_VERSION
ENV BUILD_DATE=$BUILD_DATE

ENV NODE_ENV production

COPY --from=prune /app/out/json/node_modules* ./node_modules
# TODO: Optimize the package copy to only copy package.json and dist.
COPY --from=prune /app/out/full/packages* ./packages

ARG APP

WORKDIR /app/apps/${APP}

COPY --from=prune /app/apps/${APP}/node_modules ./node_modules
COPY --from=prune /app/apps/${APP}/build ./build
COPY --from=prune /app/apps/${APP}/migrations* ./migrations
# Required to run ESM files from node due to type:module.
COPY --from=prune /app/apps/${APP}/package.json ./package.json

# Simplified alternative, but copies over more than necessary
#COPY --from=prune /app/apps/${APP}/ ./

CMD ["node", "build/main.js"]
