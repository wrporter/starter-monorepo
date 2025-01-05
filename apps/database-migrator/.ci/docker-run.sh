#!/usr/bin/env bash

set -e

APP=database-migrator
source .github/docker/config-app.sh

docker run -it --rm \
  --name=${APP_ID} \
  --env-file=apps/${APP}/.env \
  -e DB_SERVER="host.docker.internal" \
  ${APP_TAG}
