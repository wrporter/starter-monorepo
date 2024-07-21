###############################################################################
# Base image
###############################################################################
FROM node:20
FROM mcr.microsoft.com/playwright:v1.45.1-noble AS base

WORKDIR /app

RUN apt-get update && apt-get install -y ca-certificates

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

COPY --from=dependencies /app .

RUN --mount=type=cache,target=/root/.npm npm ci --loglevel=warn

COPY . .

###############################################################################
# Prune everything except what's necessary for the app
###############################################################################
FROM base AS prune

COPY --from=build /app .

ARG APP
RUN npx turbo prune --scope=test-e2e --docker

WORKDIR /app/out/json

RUN npm ci --omit=dev --loglevel=warn
RUN npm prune --omit=dev

###############################################################################
# Production image
###############################################################################
FROM base AS production

COPY --from=prune /app/out/json/node_modules ./node_modules
COPY --from=prune /app/out/full/packages* ./packages
COPY --from=prune /app/apps/test-e2e/ apps/test-e2e/

RUN npx -y playwright install --with-deps

WORKDIR /app/apps/test-e2e

CMD npm test
