#!/usr/bin/env bash

set -e

APP=test-e2e
source .github/docker/config-app.sh

docker run -it --rm \
  --name=${APP_ID} \
  -p 9323:9323 \
  --env-file=apps/test-e2e/.env \
  -v $(pwd)/apps/${APP}/test-results:/app/apps/${APP}/test-results \
  -v $(pwd)/apps/${APP}/playwright:/app/apps/${APP}/playwright \
  ${APP_TAG}
