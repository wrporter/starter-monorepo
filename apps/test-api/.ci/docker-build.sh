#!/usr/bin/env bash

set -e
source .github/docker/config.sh

APP=test-api .github/docker/build-app.sh .
