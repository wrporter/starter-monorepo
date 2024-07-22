#!/usr/bin/env bash

# Build a specific app in the workspace. The app must be defined in the apps
# directory.

set -e
source .ci/config.sh

if [[ -z "${APP}" || -z "${APP_TYPE}" ]]; then
  echo "Variables APP and APP_TYPE must be defined and corresponds to the name
  in package.json (e.g. database) and the Dockerfile in the .ci directory (e.g.
  {app-type}.Dockerfile)."
  echo "Usage: APP=database APP_TYPE=node .ci/build-app.sh"
  exit 1
fi

APP_PATH="${NAMESPACE}/${APP}"
APP_HOST_PATH="${DOCKER_HOST}/${APP_PATH}"
APP_TAG="${APP_HOST_PATH}:${GIT_COMMIT}"
APP_ID="${NAMESPACE}-${APP}"

if [ ${APP_TYPE} == "playwright" ]; then
  DOCKER_BUILDKIT=0 buildDocker \
    --build-arg APP=${APP} \
    --tag "${APP_TAG}" \
    --tag "${APP_HOST_PATH}:latest" \
    --file .ci/${APP_TYPE}.Dockerfile \
    .
else
  buildDocker \
    --build-arg BASE_IMAGE="${BASE_TAG}" \
    --build-arg APP=${APP} \
    --build-arg APP_ID=${APP_ID} \
    --build-arg BUILD_SHA=${GIT_COMMIT} \
    --build-arg BUILD_BRANCH=${GIT_BRANCH} \
    --build-arg BUILD_DATE=${BUILD_DATE} \
    --tag "${APP_TAG}" \
    --tag "${APP_HOST_PATH}:latest" \
    - < .ci/${APP_TYPE}.Dockerfile
fi
