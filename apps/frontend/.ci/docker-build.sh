#!/usr/bin/env bash

set -e
source .github/docker/config.sh

dockerBuild \
  --progress=plain \
  --build-arg APP=frontend \
  --tag=starter-monorepo-frontend \
  --file=apps/frontend/.ci/Dockerfile \
  .
