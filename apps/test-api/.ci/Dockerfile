###############################################################################
# Base image
###############################################################################
FROM node:22-alpine AS base

WORKDIR /app
RUN apk update && apk upgrade --no-cache
RUN npm config set update-notifier false

ENV TURBO_TELEMETRY_DISABLED=1

###############################################################################
# Prune to apps and packages needed just by the provided app
###############################################################################
FROM base AS prune

# See https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN npm install --global turbo

COPY . .

RUN turbo prune test-api --docker

###############################################################################
# Install dependencies and build the provided app and its dependencies
###############################################################################
FROM base AS build

# See https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat sudo
RUN npm install --global turbo

ARG TURBO_API
ARG TURBO_TEAM
ARG TURBO_TOKEN

ENV TURBO_API=$TURBO_API
ENV TURBO_TEAM=$TURBO_TEAM
ENV TURBO_TOKEN=$TURBO_TOKEN

COPY --from=prune /app/out/json/ .

RUN npm ci --loglevel=warn

COPY --from=prune /app/out/full/ .
COPY --from=prune /app/*prettier* .
# Turborepo formats these differently
RUN printf "turbo.json\npackage-lock.json" >> .prettierignore

RUN npm run ci -- --filter=test-api

RUN npm prune --omit=dev

# Prune all files from packages other than package.json and dist.
RUN sudo find packages/*/ \! \( -name "package.json" -o -name "dist" \) -mindepth 1 -maxdepth 1 -exec rm -r "{}" \; || true

###############################################################################
# Production runner image
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

ENV NODE_ENV=production

COPY --from=build /app/package*.json .
COPY --from=build /app/node_modules* ./node_modules
COPY --from=build /app/packages* ./packages

WORKDIR /app/apps/test-api

RUN chown -R node /app/apps/test-api

COPY --from=build --chown=node /app/apps/test-api/package.json .
COPY --from=build --chown=node /app/apps/test-api/ ./

USER node

CMD ["npm", "test"]
