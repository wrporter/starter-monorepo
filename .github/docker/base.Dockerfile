###############################################################################
# Build all apps and packages and publish public packages.
###############################################################################

###############################################################################
# Base image
###############################################################################
FROM node:20-alpine AS base

WORKDIR /app
RUN apk update && apk upgrade --no-cache
RUN npm config set update-notifier false

ENV TURBO_TELEMETRY_DISABLED=1

###############################################################################
# Copy over dependency files to prepare for install
###############################################################################
FROM base AS dependencies

COPY . .

RUN apk add --no-cache sudo jq

# Only re-install dependencies when there is a change to dependency definitions
RUN sudo find . \! -name "package*.json" -mindepth 3 -maxdepth 3 -print | xargs rm -rf
RUN sudo find . \! -name "package*.json" -type f -maxdepth 1 -delete
RUN sudo find . -name "package.json" -mindepth 1 -maxdepth 3 -exec sh -c 'jq "with_entries(select(.key == \"name\" or .key == \"version\" or .key == \"workspaces\" or .key == \"dependencies\" or .key == \"devDependencies\" or .key == \"optionalDependencies\" or .key == \"peerDependencies\"))" {} > tmp.$$ && mv tmp.$$ {}' \;

###############################################################################
# Install dependencies and build
###############################################################################
FROM base AS build

# See https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

COPY --from=dependencies /app .

RUN npm ci --loglevel=warn

COPY . .

RUN npm run build
