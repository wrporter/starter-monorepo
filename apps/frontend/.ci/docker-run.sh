#!/usr/bin/env bash

set -e

docker run -it --rm \
  --name=starter-monorepo-frontend \
  -p 3000:3000 \
  -p 22500:22500 \
  --env-file=apps/frontend/.env \
  -e DB_SERVER=host.docker.internal \
  -e OTEL_EXPORTER_OTLP_ENDPOINT=http://host.docker.internal:4318 \
  starter-monorepo-frontend
