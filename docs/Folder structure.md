# Folder structure

## Assets

The assets folder is used to store client side source code. This code is
compiled during a build process handled by Webpack to `.build/` which is
served by the express app.

### JavaScripts

JavaScript source code written using ES2015 syntax and compiled to ES5 using [Babel](https://babeljs.io/).

### Stylesheets

[Sass](http://sass-lang.com/) source code compiled to CSS during build process.

## Common

JavaScript modules shared between both client and server.

## Config

App wide configuration as well as library specific configuration like [nujucks](https://github.com/uktrade/data-hub-frontend/tree/develop/config/nunjucks).

## Docs

Documentation to support product development and maintenance.

## Public

Files that are served directly by the server. Files in public do not go through
any kind of build step. Normally for third-party libraries or assets that will
rarely change.

Assets referenced in CSS should not be placed here as Webpack will rewrite
paths during the build process.

## Src

Server-side source code for the [Express](https://expressjs.com/) application.

### Apps

Collection of Express [sub-apps](http://expressjs.com/en/api.html#app) with
self-contained logic.

For more information on how these are structured see the [sub-app structure documentation](./sub-apps.md).

### Lib

Server-side only modules.

### Middleware

Application-level middleware that is loaded in [server.js](https://github.com/uktrade/data-hub-frontend/blob/develop/src/server.js).

### Templates

Contains layouts, includes, macros and components that are used throughout the
views.

#### Components

Components snippets of template with specific context that are rendered using
a [custom Nunjucks tag](https://mozilla.github.io/nunjucks/api.html#custom-tags).

They resemble macros but do not have to be imported where they are needed.

## Test

Unit and acceptance test files.

### Acceptance

Acceptance tests written using the [Nightwatch](http://nightwatchjs.org/)
framework to drive the browser through each scenario.

### Unit

Isolated unit tests for controllers, middleware, libraries.
 Uses the [Mocha](https://mochajs.org/) testing framework.
