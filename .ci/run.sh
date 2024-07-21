#!/usr/bin/env bash

set -e

# app or test
TYPE=${1}
# name of app in package.json (e.g. frontend)
APP=${2}

if [ ${TYPE} == "app" ]; then
  docker run -it --init --rm \
    --name=${APP} \
    -p 3000:3000 \
    docker.io/library/${APP}
else
  docker run -it --init --rm \
    --name=${APP} \
    --network=host \
    --env ADDRESS=http://localhost:3001 \
    docker.io/library/${APP} \
    npm test
fi


