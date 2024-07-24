# Title

Author: Wesley Porter

Date: 2024-07-24

Status: proposed

## Context

To effectively manage a monorepo, a tool is needed to provide greater productivity. For example, running scripts in various apps/packages, caching executions for unchanged apps/packages, and pruning unnecessary files for a specific app. 

## Decision

Use [Turborepo](https://turbo.build/repo), a monorepo management tool that requires very minimal configuration and works with any package manager.

## Consequences

- Improve build speed by caching scripts.
- Improve repo management.
