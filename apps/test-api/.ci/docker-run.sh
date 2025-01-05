#!/usr/bin/env bash

set -e

APP=test-api
source .github/docker/config-app.sh

docker run -it --rm \
  --name=${APP_ID} \
  -e BASE_TEST_URL="http://host.docker.internal:3001" \
  ${APP_TAG}
