#!/usr/bin/env bash

set -e
source .github/docker/config.sh

dockerBuild \
  --progress=plain \
  --build-arg APP=database-migrator \
  --tag=starter-monorepo-database-migrator \
  --file=apps/database-migrator/.ci/Dockerfile \
  .