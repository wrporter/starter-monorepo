#!/usr/bin/env bash

# Build the Docker image to publish packages to the npm registry. All packages
# marked as private in package.json will not be published.

set -e
source .github/docker/config.sh

PACKAGE_TAG="${DOCKER_HOST}/${NAMESPACE}/package:latest"

buildDocker \
  --build-arg BASE_IMAGE="${BASE_TAG}" \
  --tag "${PACKAGE_TAG}" \
  - < .github/docker/package.Dockerfile

docker run --rm \
	--name="${NAMESPACE}-package" \
	${PACKAGE_TAG}
