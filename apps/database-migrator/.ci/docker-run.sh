#!/usr/bin/env bash

set -e

docker run -it --rm \
  --name=starter-monorepo-database-migrator \
  --env-file=apps/database-migrator/.env \
  -e DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/monorepo" \
  starter-monorepo-database-migrator
