# Data Hub frontend

[![CircleCI](https://circleci.com/gh/uktrade/data-hub-frontend.svg?style=svg)](https://circleci.com/gh/uktrade/data-hub-frontend)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/uktrade/data-hub-frontend.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/uktrade/data-hub-frontend/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/uktrade/data-hub-frontend.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/uktrade/data-hub-frontend/context:javascript)

An express application that fetches data from a back end JSON based api and renders it to the screen.
This front end layer is primarily turning requests from the browser into back end API calls and then
rendering them using Nunjucks template language.

The client layer applies the ideals of progressive enhancement so that a wide range of devices can
access it, no matter what their limitation.

In order to use the application the front end layer must be run, with a small number of settings,
and be provided with a back end server to provide the API, data storage and search engine capabilities.

## Table of contents

- [Getting started](#getting-started)
  - [Running project within Docker](#running-project-within-docker)
  - [Running project natively](#running-project-natively)
- [Environment variables](./docs/Environment%20variables.md)
- [Deployments](./docs/Deployments.md)
- [Conventions](./docs/Conventions.md)
- [Templating With Nunjucks](./docs/Templating%20with%20Nunjucks.md)
- [Running tests](./docs/Running%20tests.md)
- [Code Review guidelines](./docs/Code%20review%20guidelines.md)
- [Folder structure](./docs/Folder%20structure.md)
- [Sub-apps](./docs/Sub-apps.md)
- [Feature flags](./docs/Feature%20flags.md)
- [Upgrading Node version](./docs/Upgrading%20Node%20version.md)
- [Single sign-on](./docs/Single%20sign-on.md)
- [Making changes](#making-changes)
- [Formatting markdown files](#formatting-markdown-files)

## Getting started

### Running project within Docker

1.  Go to the project root.

2.  Create a `.env` file with `cp docker.sample.env .env`.

3.  By default, the frontend container will use the mock-sso instance specified
    in `docker-compose.yml`.  To use this, you will also need to specify the `MOCK_SSO_USERNAME`
    environment variable in `.env`.
    This value should correspond with an `Advisor.email` value in the Data Hub backend

4.  Optionally, you can point the frontend to a different backend by specifying
    an `API_ROOT` in `.env`. e.g. To connect the frontend docker container to the
    shared dev environment backend.

    If you want to point `API_ROOT` to a data-hub-api docker container, ensure
    that both containers are running under docker-compose with the same
    `COMPOSE_PROJECT_NAME` specified in each `.env` file. This will make sure
    that the containers share a network. The following snippet in `.env` should then
    do the trick:

    ```
    API_ROOT=http://api:8000
    ```
  
5.  Start the server:

    ```bash
    docker-compose up frontend
    ```

    The server will start in developer mode, which means that when you make local changes it will auto-compile assets, and will restart nodejs.

    You can access the server on port 3000,
    [http://localhost:3000](http://localhost:3000). You can also run a remote
    debug session over port 9229 if using webstorm/Intellij or Visual Studio Code.

### Running project natively

1.  Navigate to the project root.

2.  Install the required version of node:

    ```bash
    brew install nvm
    nvm use 10.16.0
    ```

3.  Ensure correct version of yarn is used:

    ```bash
    yarn policies set-version 1.16.0
    ```

4.  Install node packages:

    ```bash
    yarn
    ```

5.  Create a copy of a sample `.env` file which points to a mocked API:

    ```bash
    cp sample.env .env
    ```

    See [supported environment variables](./docs/Environment%20variables.md).

6.  Start redis server:

    ```bash
    docker run -it -p 6379:6379 redis:3.2
    ```

7.  Start the mocked SSO:

    ```bash
    docker run -it -p 8080:8080 quay.io/uktrade/mock-sso:latest
    ```

8.  Start the mocked backend:

    ```bash
    docker run -it -p 8001:8001 ukti/data-hub-sandbox:1.0.0
    ```

9.  Start the node server

    **In production mode:**

    ```bash
    export NODE_ENV=production
    yarn run build && yarn start
    ```

    This will build static assets beforehand and then run the app.

    **In development mode:**

    ```bash
    yarn run develop
    ```

    Server will watch for changes and rebuild sass or compile js using webpack as
    needed. Changes to server side code will result in the server autorestarting.
    The server will run with the node debug flag so you can debug with Webstorm
    or Visual Studio Code.

## Making changes

See the [contributing guide](./CONTRIBUTING.md).

## Formatting markdown files

You can use Prettier to automatically reformat markdown files, which is very useful for tables:

```bash
prettier --write README.md
```

On Webstorm you can use `ALT+SHIFT+COMMAND+P` shortcut.
