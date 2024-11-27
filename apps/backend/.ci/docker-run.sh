#!/usr/bin/env bash

set -e

docker run -it --rm \
  --name=starter-monorepo-backend \
  -p 3001:3001 \
  -p 22501:22501 \
  --env-file=apps/backend/.env \
  -e DB_SERVER=host.docker.internal \
  -e OTEL_EXPORTER_OTLP_ENDPOINT=http://host.docker.internal:4318 \
  starter-monorepo-backend
