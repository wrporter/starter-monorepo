###############################################################################
# Base image
###############################################################################
FROM mcr.microsoft.com/playwright:v1.49.0-noble AS base

WORKDIR /app

RUN apt-get update && apt-get install -y ca-certificates
RUN npm config set update-notifier false

ENV TURBO_TELEMETRY_DISABLED=1

###############################################################################
# Prune to apps and packages needed just by the provided APP
###############################################################################
FROM base AS prune

RUN npm install --global turbo

ARG APP

COPY . .

RUN turbo prune ${APP} --docker

###############################################################################
# Install dependencies and build the provided APP and its dependencies
###############################################################################
FROM base AS build

RUN npm install --global turbo

ARG APP

ARG TURBO_API
ARG TURBO_TEAM
ARG TURBO_TOKEN

ENV TURBO_API=$TURBO_API
ENV TURBO_TEAM=$TURBO_TEAM
ENV TURBO_TOKEN=$TURBO_TOKEN

COPY --from=prune /app/out/json/ .

# Install dependencies
RUN npm ci --loglevel=warn

COPY --from=prune /app/out/full/ .
COPY --from=prune /app/*prettier* .
# Turborepo formats these differently
RUN printf "turbo.json\npackage-lock.json" >> .prettierignore

# Validate
RUN npm run ci -- --filter=${APP}

RUN npm prune --omit=dev

###############################################################################
# Production image
###############################################################################
FROM base AS production

ARG APP

COPY --from=build /app/package*.json .
COPY --from=build /app/node_modules* ./node_modules

WORKDIR /app/apps/${APP}

COPY --from=build /app/apps/${APP}/ ./

RUN npx -y playwright install --with-deps

CMD ["npx", "playwright", "test"]
