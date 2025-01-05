#!/usr/bin/env bash

set -e
source .github/docker/config.sh

APP=test-e2e .github/docker/build-app.sh .
