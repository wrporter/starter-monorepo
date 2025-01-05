#!/usr/bin/env bash

# Docker config specific to an app.

source .github/docker/config.sh

if [[ -z "${APP}" ]]; then
  echo "Variable APP must be defined and corresponds to the name in package.json (e.g. frontend)"
  echo "Usage: APP=frontend .github/docker/build-app.sh"
  exit 1
fi

APP_PATH="${NAMESPACE}/${APP}"
APP_HOST_PATH="${DOCKER_REGISTRY}/${APP_PATH}"
APP_TAG="${APP_HOST_PATH}:${GIT_COMMIT}"
APP_ID="${NAMESPACE}-${APP}"
