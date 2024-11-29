#!/usr/bin/env bash

set -e
source .github/docker/config.sh

dockerBuild \
  --build-arg APP=test-e2e \
  --tag=starter-monorepo-test-e2e \
  --file=apps/test-e2e/.ci/Dockerfile \
  .
