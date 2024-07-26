# Title

Author: Wesley Porter

Date: 2024-07-26

Status: proposed

## Context

There are coding patterns that can more commonly introduce bugs. We need a tool to automatically detect these issues and guard against them.

## Decision

Use ESLint for fixing common problems.

## Consequences

- Developers will need to run `npm run lint` and `npm run lint:fix` to ensure their code is linted and fixable issues are resolved.
