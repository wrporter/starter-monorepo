#!/usr/bin/env bash

set -e
source .github/docker/config.sh

dockerBuild \
  --build-arg APP=frontend \
  --tag=starter-monorepo-frontend \
  --file=apps/frontend/.ci/Dockerfile \
  .
