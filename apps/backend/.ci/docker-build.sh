#!/usr/bin/env bash

set -e
source .github/docker/config.sh

dockerBuild \
  --build-arg APP=backend \
  --tag=starter-monorepo-backend \
  --file=apps/backend/.ci/Dockerfile \
  .
