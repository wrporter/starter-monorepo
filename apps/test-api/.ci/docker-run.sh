#!/usr/bin/env bash

set -e

docker run -it --rm \
  --name=starter-monorepo-test-api \
  --env-file=apps/test-api/.env \
  -e BASE_URL="http://host.docker.internal:3000" \
  starter-monorepo-test-api
