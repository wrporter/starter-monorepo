###############################################################################
# Base image
###############################################################################
FROM node:20-alpine AS base

WORKDIR /app
RUN apk update && apk upgrade --no-cache && apk add --no-cache sudo
RUN npm config set update-notifier false

ENV TURBO_TELEMETRY_DISABLED=1

###############################################################################
# Copy over dependency files to prepare for install
###############################################################################
FROM base AS dependencies

COPY . .

# Find and remove non-package.json files
RUN sudo find . \! -name "package*.json" -mindepth 3 -maxdepth 3 -print | xargs rm -rf

###############################################################################
# Install dependencies and build
###############################################################################
FROM base AS build

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
COPY --from=dependencies /app .

RUN --mount=type=cache,target=/root/.npm npm ci --loglevel=warn

COPY . .

ARG APP
RUN npm run build --scope=${APP}

###############################################################################
# Prune everything except what's necessary for the app
###############################################################################
FROM base AS prune

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

COPY --from=build /app .

ARG APP
RUN npx turbo prune --scope=${APP} --docker

WORKDIR /app/out/json

RUN npm ci --omit=dev --loglevel=warn
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

ARG APP

COPY --from=prune /app/out/json/node_modules ./node_modules
# TODO: Can we optimize the package copy so we only copy over built assets?
# Use the wildcard to not fail for apps that don't consume any packages
COPY --from=prune /app/out/full/packages* ./packages
#COPY --from=prune /app/apps/${APP}/node_modules ./apps/${APP}/node_modules
#COPY --from=prune /app/apps/${APP}/build apps/${APP}/build
#COPY --from=prune /app/apps/${APP}/migrations* apps/${APP}/migrations
#COPY --from=prune /app/apps/${APP}/package.json apps/${APP}/package.json
COPY --from=prune /app/apps/${APP}/ apps/${APP}/

WORKDIR /app/apps/${APP}

CMD node build/main.js
