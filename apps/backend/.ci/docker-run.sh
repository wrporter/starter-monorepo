#!/usr/bin/env bash

set -e

APP=backend
source .github/docker/config-app.sh

docker run -it --rm \
  --name=${APP_ID} \
  -p 3001:3001 \
  -p 22501:22501 \
  --env-file=apps/${APP}/.env \
  -e NODE_ENV=production \
  -e DB_SERVER=host.docker.internal \
  -e OTEL_EXPORTER_OTLP_ENDPOINT=http://host.docker.internal:4318 \
  ${APP_TAG}
