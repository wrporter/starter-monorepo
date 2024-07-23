#!/usr/bin/env bash

# TODO: Consider removing in favor of only using docker-compose and GitHub Actions.
#       Make sure to also remove the docker:build script in each package.json file.
# Build a specific app in the workspace. The app must be defined in the apps
# directory.

set -e
source .github/docker/config.sh

if [[ -z "${APP}" || -z "${APP_TYPE}" ]]; then
  echo "Variables APP and APP_TYPE must be defined and corresponds to the name
  in package.json (e.g. database) and the Dockerfile in the .github/docker directory (e.g.
  {app-type}.Dockerfile)."
  echo "Usage: APP=database APP_TYPE=node .github/docker/build-app.sh"
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
    --file .github/docker/${APP_TYPE}.Dockerfile \
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
    - < .github/docker/${APP_TYPE}.Dockerfile
fi
