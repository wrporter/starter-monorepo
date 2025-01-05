#!/usr/bin/env bash

set -e
source .github/docker/config-app.sh

echo "-- ${0} start..."
echo "-- Pushing docker image to registry with tags [latest, ${VERSION}]"
echo "-- Image: ${APP_HOST_PATH}"

docker tag ${APP_HOST_PATH}:${VERSION} ${APP_HOST_PATH}:latest
docker push ${APP_HOST_PATH} --all-tags

echo "-- ${0} complete!"
