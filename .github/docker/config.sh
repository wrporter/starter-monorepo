#!/usr/bin/env bash

# Common config for Docker building scripts.

# TODO: Configure these for your app
SLACK_CHANNEL="#slack_channel"
DOCKER_HOST=${DOCKER_HOST:="docker.io"}

NAMESPACE=$(basename `git rev-parse --show-toplevel`)

GIT_REPO_URL="${GIT_URL:-$(git remote get-url origin)}"
GIT_COMMIT=${GIT_COMMIT:-$(git rev-parse HEAD)}
GIT_AUTHOR_EMAIL=${GIT_AUTHOR_EMAIL:-$(git show -s --format="%ae" HEAD)}
GIT_BRANCH=${GIT_BRANCH:-"$(git rev-parse --abbrev-ref HEAD)"}
GIT_BRANCH_NAME=$(echo ${GIT_BRANCH} | rev | cut -d/ -f1 | rev)

BUILD_ID=${BUILD_ID:="LOCAL_BUILD_ID"}
BUILD_DATE=$(date -u '+%Y-%m-%dT%H:%M:%SZ')

BASE_PATH="${NAMESPACE}/base"
BASE_HOST_PATH="${DOCKER_HOST}/${BASE_PATH}"
BASE_TAG="${BASE_HOST_PATH}:${GIT_COMMIT}"

function dockerBuild() {
  docker build \
    --label "build-info.build-time=${BUILD_DATE}" \
    --label "build-info.git-branch=${GIT_BRANCH_NAME}" \
    --label "build-info.git-commit=${GIT_COMMIT}" \
    --label "build-info.git-repo=${GIT_REPO_URL}" \
    --label "build-info.git-user-email=${GIT_AUTHOR_EMAIL}" \
    --label "build-info.slack-channel=${SLACK_CHANNEL}" \
    --build-arg TURBO_API="http://${DOCKER_HOST_IP:-"host.docker.internal"}:${TURBOGHA_PORT:-"41230"}" \
    --build-arg TURBO_TEAM=${TURBO_TEAM} \
    --build-arg TURBO_TOKEN=${TURBO_TOKEN} \
    $@
}
