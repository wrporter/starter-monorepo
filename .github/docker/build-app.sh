#!/usr/bin/env bash

# Build a specific app in the workspace. The app must be defined in the apps
# directory.

set -e
source .github/docker/config-app.sh

echo "-- ${0} start..."
echo "-- Building image: [${APP_HOST_PATH}:latest, ${APP_TAG}]"

dockerBuild \
  --file=apps/${APP}/.ci/Dockerfile \
  --build-arg APP_ID=${APP_ID} \
  --tag "${APP_TAG}" \
  --tag "${APP_HOST_PATH}:latest" \
#  Use if you need a npm auth token for private packages.
#  --secret id=NPM_AUTH_TOKEN \
  $@

echo "-- ${0} complete!"
