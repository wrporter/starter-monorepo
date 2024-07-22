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

RUN apt-get install -y sudo jq

# Only re-install dependencies when there is a change to dependency definitions
RUN sudo find . \! -name "package*.json" -mindepth 3 -maxdepth 3 -print | xargs rm -rf
RUN sudo find . \! -name "package*.json" -type f -maxdepth 1 -delete
RUN sudo find . -name "package.json" -mindepth 1 -maxdepth 3 -exec sh -c 'jq "with_entries(select(.key == \"name\" or .key == \"version\" or .key == \"workspaces\" or .key == \"dependencies\" or .key == \"devDependencies\" or .key == \"optionalDependencies\" or .key == \"peerDependencies\"))" {} > tmp.$$ && mv tmp.$$ {}' \;

###############################################################################
# Install dependencies and build
###############################################################################
FROM base AS build

COPY --from=dependencies /app .

RUN npm ci --loglevel=warn

COPY . .

# TODO: Add when E2E tests depend on packages.
#RUN npm run build

###############################################################################
# Prune everything except what's necessary for the app
###############################################################################
FROM base AS prune

COPY --from=build /app .

ARG APP
RUN npx turbo prune --scope=${APP} --docker

WORKDIR /app/out/json

RUN npm prune --omit=dev

###############################################################################
# Production image
###############################################################################
FROM base AS production

COPY --from=prune /app/out/json/node_modules ./node_modules
# TODO: Optimize the package copy to only copy package.json and dist.
# TODO: Add when E2E tests depend on packages.
#COPY --from=prune /app/out/full/packages ./packages

ARG APP

WORKDIR /app/apps/${APP}

COPY --from=prune /app/apps/${APP}/ ./

RUN npx -y playwright install --with-deps

CMD ["npx", "playwright", "test"]
