#!/usr/bin/env bash

set -e

# name of app in package.json (e.g. frontend)
APP=${1}

if [ ${APP} == "test-e2e" ]; then
  docker build \
    -f apps/test-e2e/Dockerfile \
    -t ${APP} \
    .
else
  docker build \
    --build-arg APP=${APP} \
    -f .ci/Dockerfile \
    -t ${APP} \
    .
fi
