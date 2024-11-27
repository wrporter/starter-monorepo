#!/usr/bin/env bash

set -e

docker run -it --rm \
  -p 9323:9323 \
  --name=starter-monorepo-test-e2e \
  --env-file=apps/test-e2e/.env \
  -v $(pwd)/apps/test-e2e/test-results:/app/apps/test-e2e/test-results \
  -v $(pwd)/apps/test-e2e/playwright:/app/apps/test-e2e/playwright \
  starter-monorepo-test-e2e /bin/bash

