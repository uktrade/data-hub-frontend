# Data Hub frontend

[![CircleCI](https://circleci.com/gh/uktrade/data-hub-frontend.svg?style=svg)](https://circleci.com/gh/uktrade/data-hub-frontend)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://uktrade.github.io/data-hub-frontend)

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
  - [Navigating the code](./docs/CodePathMap.png)
- [Environment variables](#environment-variables)
- [Deployments](./docs/Deployments.md)
- [Conventions](./docs/Conventions.md)
- [Templating With Nunjucks](./docs/Templating%20with%20Nunjucks.md)
- [Running tests](./docs/Running%20tests.md)
- [Code Review guidelines](./docs/Code%20review%20guidelines.md)
- [Sub-apps](./docs/Sub-apps.md)
- [Feature flags](./docs/Feature%20flags.md)
- [Upgrading Node version](./docs/Upgrading%20Node%20version.md)
- [Single sign-on](./docs/Single%20sign-on.md)
- [Making changes](#making-changes)
- [Formatting markdown files](#formatting-markdown-files)
- [Managing Dependabot PRs](./docs/Dependabot.md)
- [Adding a new page](./docs/Adding%20a%20new%20page.md)

## Getting started

### Running the project within Docker

Please view the dedicated [Docker readme](./docs/Docker.md).

### Running the project natively (recommended method)

**Note for all users** If you wish to run the functional tests against your native frontend, you will need to pass a config flag to point cypress to run against port 3000 - `npm run test:functional:watch --config baseUrl=http://localhost:3000`.

**Note for Civil Servant developers** When running the project natively for the first time on your DBT-issued device you will need to setup ZSH. Instructions for this are available [here](./docs/ZSH%20setup.md)

1.  Navigate to the project root.

2.  Install the required version of node:

    ```bash
    brew install nvm
    nvm use 22.12.0
    ```

3.  Install node packages:

    ```bash
    npm install
    ```

4.  Create a copy of the `sample.env` file.

    ```bash
    cp sample.env .env
    ```

Steps 5 onwards differ depending on which API you are using. Skip to section 'Running with the local API' or 'Running with other APIs (e.g. staging)' depending on what you want to do. If you have any issues, please consult the [troubleshooting guidance](./docs/Troubleshooting.md).

**Running with the local API**

Use this method if you want to make backend changes or run against an API branch which hasn't yet been deployed.

5.  The environment variables copied from `sample.env` are set up for running both the frontend and the API using the docker set-up outlined [here](./docs/Docker.md). To run the frontend natively, the following variables will need to be changed to:

    ```
    LOCAL_DEV=True
    API_ROOT=http://127.0.0.1:8000
    REDIS_HOST=localhost
    REDIS_URL=redis://localhost:6379
    ```

6.  Bring up Data Hub API using the instructions outlined in the repository's [`README.md`](https://github.com/uktrade/data-hub-api/blob/develop/README.md).

7.  Go to http://localhost:8000/admin/add-access-token/ to get an access token. Add a frontend environment variable `OAUTH2_DEV_TOKEN` and set this as equal to the access token.

8.  Start the node server

    **In production mode:**

    ```bash
    export NODE_ENV=production
    npm run build && npm start
    ```

    This will build static assets beforehand and then run the app.

    **In development mode:**

    ```bash
    npm run develop
    ```

    The server will watch for changes and rebuild sass or compile js using webpack as
    needed. Changes to server side code will result in the server autorestarting.
    The server will run with the node debug flag so you can debug with Webstorm
    or Visual Studio Code.

**Running with other APIs (e.g. staging)**

This method is recommended if you are only making frontend changes.

5.  Go to the [Playbook](https://readme.trade.gov.uk/docs/playbooks/datahub.html#environments), find the environment you want to use in the Admin URLs section, and set this URL to the environment variable `API_ROOT`. You will need to remove `/admin` from the end of the API path.

6.  Go to the parameter store in AWS (https://eu-west-2.console.aws.amazon.com/systems-manager/parameters/?region=eu-west-2&tab=Table). Change the following environment variables in your `.env` file to the ones specified in the parameter store. Remember to select the correct envriorment (e.g dev, uat, staging) you are using.

> **Warning**
> Gov PaaS will be deprecated from July 2024 and keys will be moved from Vault to Parameter Store.
>
> Go to Vault, look in datahub-fe, and click on the environment you want to use. Change the following environment variables in your `.env` file to the ones specified in Vault:

```
DATA_HUB_BACKEND_ACCESS_KEY_ID=frontend-key-id
DATA_HUB_BACKEND_SECRET_ACCESS_KEY=frontend-key
```

7.  The environment variables copied from `sample.env` are set up for running both the frontend and the API using the docker. To run the frontend natively, the following variables will need to be changed to:

    ```
    REDIS_HOST=localhost
    REDIS_URL=redis://localhost:6379
    ```

8.  [Install](./docs/Installing%20redis%20natively.md) the redis server and bring it up:

    ```bash
    redis-server
    ```

    or run in docker

    ```bash
    docker run -it -p 6379:6379 redis:6.2.6
    ```

9.  Go to the Django admin site for your relevant environment and get an access token by adding the following path `/add-access-token/` to the URL. Add a frontend environment variable `OAUTH2_DEV_TOKEN` and set this as equal to the access token.

10. Start the node server

    **In production mode:**

    ```bash
    export NODE_ENV=production
    npm run build && npm start
    ```

    This will build static assets beforehand and then run the app.

    **In development mode:**

    ```bash
    npm run develop
    ```

    The server will watch for changes and rebuild sass or compile js using webpack as
    needed. Changes to server side code will result in the server autorestarting.
    The server will run with the node debug flag so you can debug with Webstorm
    or Visual Studio Code.

### Working with SSO

`SSO_ENABLED` is set to false by default which will bypass any authentication. However, if working on integration with SSO, these sets of instructions can be followed to enable SSO.

**Mock SSO**

To use the mock SSO service, add the environment variables from `sample.env` below the line 'To use mock-SSO' into your `.env` file and uncomment.

Set `SSO_ENABLED=true` and start the mocked SSO:

```bash
docker run -it -p 8080:8080 gcr.io/sre-docker-registry/github.com/uktrade/mock-sso:latest
```

**Live SSO**

To use the live SSO service, add the environment variables from `sample.env` below the line 'To use live SSO' into your `.env` file and uncomment.

Set `SSO_ENABLED=true` and then restart your development environment.

These instructions work for both the dockerised environment and the native environment.

### Environment variables

List of all environment variables can be found in the source code of [envSchema.js](./src/config/envSchema.js).

Check AWS parameter store for environment variables that point to other environments, such as staging and dev.

## Making changes

See the [contributing guide](./CONTRIBUTING.md).

## Formatting markdown files

You can use Prettier to automatically reformat markdown files, which is very useful for tables:

```bash
prettier --write README.md
```

On Webstorm you can use `ALT+SHIFT+COMMAND+P` shortcut.
