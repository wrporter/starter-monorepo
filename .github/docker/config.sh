#!/usr/bin/env bash

# Common config for Docker building scripts.

DOCKER_REGISTRY=${DOCKER_REGISTRY:="docker.io"}

# Use the repository name as the namespace
NAMESPACE=$(basename `git rev-parse --show-toplevel`)

GIT_REPO_URL="${GIT_URL:-$(git remote get-url origin)}"
GIT_COMMIT=${GIT_COMMIT:-$(git rev-parse HEAD)}
GIT_AUTHOR_EMAIL=${GIT_AUTHOR_EMAIL:-$(git show -s --format="%ae" HEAD)}
GIT_BRANCH=${GIT_BRANCH:-"$(git rev-parse --abbrev-ref HEAD)"}
GIT_BRANCH_NAME=$(echo ${GIT_BRANCH} | rev | cut -d/ -f1 | rev)

BUILD_ID=${BUILD_ID:="LOCAL_BUILD_ID"}
BUILD_DATE=$(date -u '+%Y-%m-%dT%H:%M:%SZ')

function dockerBuild() {
  # Use the host network to enable turbo caching with a locally running cache server.
  docker build \
    --network=host \
    --label "build-info.build-time=${BUILD_DATE}" \
    --label "build-info.git-branch=${GIT_BRANCH_NAME}" \
    --label "build-info.git-commit=${GIT_COMMIT}" \
    --label "build-info.git-repo=${GIT_REPO_URL}" \
    --label "build-info.git-user-email=${GIT_AUTHOR_EMAIL}" \
    --build-arg BUILD_BRANCH=${GIT_BRANCH} \
    --build-arg BUILD_SHA=${GIT_COMMIT} \
    --build-arg BUILD_DATE=${BUILD_DATE} \
    --build-arg TURBO_API=${TURBO_API} \
    --build-arg TURBO_TEAM=${TURBO_TEAM} \
    --build-arg TURBO_TOKEN=${TURBO_TOKEN} \
    $@
}
