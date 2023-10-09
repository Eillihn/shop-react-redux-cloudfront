# React-shop-cloudfront

This is frontend starter project for nodejs-aws mentoring program. It uses the following technologies:

- [Vite](https://vitejs.dev/) as a project bundler
- [React](https://beta.reactjs.org/) as a frontend framework
- [React-router-dom](https://reactrouterdotcom.fly.dev/) as a routing library
- [MUI](https://mui.com/) as a UI framework
- [React-query](https://react-query-v3.tanstack.com/) as a data fetching library
- [Formik](https://formik.org/) as a form library
- [Yup](https://github.com/jquense/yup) as a validation schema
- [Serverless](https://serverless.com/) as a serverless framework
- [Vitest](https://vitest.dev/) as a test runner
- [MSW](https://mswjs.io/) as an API mocking library
- [Eslint](https://eslint.org/) as a code linting tool
- [Prettier](https://prettier.io/) as a code formatting tool
- [TypeScript](https://www.typescriptlang.org/) as a type checking tool

## Available Scripts

### `start`

Starts the project in dev mode with mocked API on local environment.

### `build`

Builds the project for production in `dist` folder.

### `preview`

Starts the project in production mode on local environment.

### `test`, `test:ui`, `test:coverage`

Runs tests in console, in browser or with coverage.

### `lint`, `prettier`

Runs linting and formatting for all files in `src` folder.

### `client:deploy`, `client:deploy:nc`

Deploy the project build from `dist` folder to configured in `serverless.yml` AWS S3 bucket with or without confirmation.

### `client:build:deploy`, `client:build:deploy:nc`

Combination of `build` and `client:deploy` commands with or without confirmation.

### `cloudfront:setup`

Deploy configured in `serverless.yml` stack via CloudFormation.

### `cloudfront:domainInfo`

Display cloudfront domain information in console.

### `cloudfront:invalidateCache`

Invalidate cloudfront cache.

### `cloudfront:build:deploy`, `cloudfront:build:deploy:nc`

Combination of `client:build:deploy` and `cloudfront:invalidateCache` commands with or without confirmation.

### `cloudfront:update:build:deploy`, `cloudfront:update:build:deploy:nc`

Combination of `cloudfront:setup` and `cloudfront:build:deploy` commands with or without confirmation.

### `serverless:remove`

Remove an entire stack configured in `serverless.yml` via CloudFormation.

# Task 1:
### CloudFront URL:
https://d3444z4xskp0c.cloudfront.net/

### S3-website:
https://shop-react-redux-cloudfront---hs.s3.eu-west-1.amazonaws.com/index.html

# Task 2:
### Product Service API:
- https://s2e3pw15wc.execute-api.eu-west-1.amazonaws.com/dev/products
- https://s2e3pw15wc.execute-api.eu-west-1.amazonaws.com/dev/products/1

### SWAGGER documentation:
https://app.swaggerhub.com/apis/Eillihn/shop-react-redux-cloudfront/1.0.0

# Notes:

## EMFILE error
To fix EMFILE error when launching the serverless “deploy” script:

1. install graceful-fs: npm install graceful-fs
2. go to file: node_modules/serverless/lib/plugins/package/lib/zip-service.js
3. replace this line:
   const fs = BbPromise.promisifyAll(require('fs'));
   by this:
   var realFs = require('fs')
   var gracefulFs = require('graceful-fs')
   gracefulFs.gracefulify(realFs)
   const fs = BbPromise.promisifyAll(realFs);
