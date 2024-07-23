###############################################################################
# Image for publishing packages to the npm registry.
###############################################################################

###############################################################################
# Image containing all built artifact code
###############################################################################
ARG BASE_IMAGE
FROM ${BASE_IMAGE} AS artifact

###############################################################################
# Built assets with an image ready to run commands
###############################################################################
FROM node:20-alpine AS base

WORKDIR /app
RUN apk update && apk upgrade --no-cache
RUN npm config set update-notifier false

COPY --from=artifact /app .

ENTRYPOINT []

# TODO: Add documentation generation to packages
# RUN npx turbo run docs

CMD ["npx", "changeset", "publish"]
