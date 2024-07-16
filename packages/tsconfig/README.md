# @repo/tsconfig

This project maintains base tsconfig files for TypeScript projects. Each file may be extended and custom configuration may be added. This package provides a convenience of not having to copy and paste the same configs for every new project.

## Installation

```shell
npm install --save-dev @repo/tsconfig
```

## Usage

In your `tsconfig.json`, extend the config file that suits your project. For example:

```json
{
  "extends": "@repo/tsconfig/base.json",
  "include": ["src"],
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

**Note:** All configuration options that use relative paths, such as `includes`, `excludes`, `outDir`, etc. are relative to the location of the tsconfig file itself. Therefore, these configs do not use those configuration options. They must be configured by the consuming project itself.

## API

Below are each of the configuration files available and their explanations.

- [`base.json`](./base.json): Base config consumed by just about all the other configs in this project with common compiler options.
- [`react.json`](./react.json): Config for a React application.
- [`node.json`](./node.json): Config for an NodeJS application.
- [`lib.json`](./lib.json): Config for a npm package.
- [`api-tests.json`](./api-tests.json): Config for an API test project.
