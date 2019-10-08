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

## Table of Contents
- [Getting started](#getting-started)
  - [Environment variables](#environment-variables)
  - [Running project within Docker](#running-project-within-docker)
  - [Running project natively](#running-project-natively)
  - [Installation](#installation)
    - [Run in production mode](#run-in-production-mode)
    - [Run in development mode](#run-in-development-mode)
  - [Updating NodeJs](#updating-nodejs)
    - [Cloud foundry build pack](#cloud-foundry-build-pack)
    - [Engines package.json](#engines-package-json)
    - [CircleCi config](#circleci-config)
    - [Data hub base docker](#data-hub-base-docker)
  - [OAuth](#oauth)
    - [Bypassing OAuth in development mode](#bypassing-oauth-in-development-mode)
    - [Using SSO when developing](#using-sso-when-developing)
    - [SSO development providers](#sso-development-providers)
      - [SSO mock](#sso-mock)
      - [UAT SSO](#uat-sso)
      - [Local checkout of staff SSO](#local-checkout-of-staff-sso)
  - [Other Scripts](#other-scripts)
- [Making changes](#making-changes)
- [Components](#components)
- [Templates](#templates)
  - [Nunjucks base template blocks](#nunjucks-base-template-blocks)
  - [Base template variables](#base-template-variables)
  - [Template inheritance diagram](#template-inheritance-diagram)
- [Testing](#testing)
  - [Functional Testing](#functional-testing)
  - [Acceptance Testing](#acceptance-testing)
    - [Running acceptance tests](#running-acceptance-tests)
    - [Running tests with specific user permissions](#running-tests-with-specific-user-permissions)
      - [Dev api tokens](#dev-api-tokens)
      - [Dev api tokens](#dev-api-tokens)
      - [Backend locally with user permission tokens](#backend-locally-with-user-permission-tokens)
      - [Adding tokens](#adding-tokens)
    - [Naming conventions](#naming-conventions)
      - [Folders](#folders)
      - [Filenames](#filenames)
      - [Feature tags](#feature-tags)
      - [Scenario tags](#scenario-tags)
      - [Permissions tags](#permissions-tags)
    - [Ignoring features](#ignoring-features)
  -[Visual Testing](#visual-testing)
- [Continuous Integration](#continuous-integration)
  - [Running CI jobs](#running-ci-jobs)
  - [Setting up users with different permissions](#setting-up-users-with-different-permissions)
  - [Base docker image](#base-docker-image)
  - [Data hub backend docker image](#data-hub-backend-docker-image)
  - [Mock SSO docker build](#mock-sso-docker-build)
  - [Job failure](#job-failure)
- [Deployment](#deployment)


## Getting started

### Environment variables

| Name | Description |
|:-----|:------------|
| API_ROOT | The url for a back end server instance for the service |
| ARCHIVED_DOCUMENTS_BASE_URL | The url for the archived documents store |
| ASSETS_HOST | Optional host for assets CDN, defaults to app’s host |
| BASIC_AUTH_USER | Optional. If running a server with OAUTH2_BYPASS_SSO=true then this can be used in conjunction with a password to setup basic HTTP auth to protect the server |
| BASIC_AUTH_PASSWORD |  Used in conjunction with BASIC_AUTH_USER to setup security for the server |
| CI | Set to true for UAT testing, otherwise ignore |
| DATA_HUB_BACKEND_ACCESS_KEY_ID | Indentifier of a Hawk key required to access the backend metadata endpoints |
| DATA_HUB_BACKEND_SECRET_ACCESS_KEY | Secret Hawk key required to access the backend metadata endpoints |
| FEATURES_FOLDER | Lo  cation of the Cucumber feature files |
| GOOGLE_TAG_MANAGER_KEY | The key needed to integrate with Google Tag Manager to track usage |
| LOG_LEVEL | How much logging to output: defaults to `debug` in dev and `error` everywhere else |
| METADATA_TTL | How long to store dropdown data etc for, in seconds. Defaults to 15 minutes |
| NODE_ENV | Whether to run the app in dev mode. Set to `production` in production, otherwise don't set for dev behaviour |
| OMIS_ARCHIVED_DOCUMENTS_BASE_URL | The base URL for the OMIS archived document store. Holds archived quotes and deliverables |
| OAUTH2_TOKEN_FETCH_URL | OAuth fetch token url |
| OAUTH2_USER_PROFILE_URL | OAuth user profile url |
| OAUTH2_AUTH_URL | OAuth auth url |
| OAUTH2_CLIENT_ID | OAuth client id |
| OAUTH2_CLIENT_SECRET | OAuth client secret |
| OAUTH2_REDIRECT_URL | OAuth callback url |
| OAUTH2_BYPASS_SSO | If a developer wishes to bypass OAuth locally then set this to true - defaults to `false` |
| OAUTH2_DEV_TOKEN | Token used for working with OAuth locally whilst developing. This token is also used with CircleCi for providing user with different permissions |
| POSTCODE_KEY | Part of the frontend looks up addresses for postcodes using [getaddress.io](https://getaddress.io/). Obtain a key for the service and set it here |
| PROJECT_PHASE | Which badge to display in header: 'Alpha', 'Beta' or 'Demo' - defaults to 'Beta' @TODO - remove when Demo site is decommissioned|
| PROXY | URL of a proxy to use to contact the API through. Useful for debugging |
| QA_HOST | URL of the app under test |
| QA_SELENIUM_HOST | URL of the Selenium server |
| QA_SELENIUM_PORT | Port to use for the Selenium server |
| REDISTOGO_URL | For use with heroku (deprecated) |
| REDIS_HOST | You need to run redis and provide the host name for it here unless you specify the entire url - defaults to 'redis'|
| REDIS_PORT | Redis port, defaults to `6379` |
| REDIS_URL | A full length url to connect to redis |
| REDIS_USE_TLS | Boolean - whether Redis is proxied through stunnel or not. Defaults to false |
| SENTRY_DSN | Sentry DSN (optional) |
| SESSION_SECRET | String to encrypt session data with |
| SESSION_TTL | How long the user session lasts, in millis. Defaults to 2 hours |
| TEAM_SITE_SHARE_POINT_URL | Team site share point url |
| WEBPACK_ENV | Optionally select the webpack configuration variation to use, the default will correctly pick a production or development config based on NODE_ENV. Valid values include `prod`, `develop` and `docker` |
| HELP_CENTRE_URL | Help centre url |
| HELP_CENTRE_ANNOUNCMENTS_URL | Help centre announcements url |
| HELP_CENTRE_API_FEED | Help centre feed API url |
| HELP_CENTRE_FEED_API_TOKEN | Help centre API token |

### Running project within Docker

1.  Go to the project root.
  
2.  Start the server:

    ```bash
    docker-compose up
    ```

    The server will start in developer mode, which means that when you make local changes it will auto-compile assets, and will restart nodejs.

    You can access the server on port 3000,
    [http://localhost:3000](http://localhost:3000). You can also run a remote
    debug session over port 9229 if using webstorm/Intellij or Visual Studio Code.
  
3.  Optionally, you can point the frontend to a different backend:
    
    ```bash
    API_ROOT=example.com docker-compose up frontend
    ```

    If using the mock-sso instance specified in `docker-compose.yml`, you will 
    also need to specify the `MOCK_SSO_USERNAME` environment variable in `.env`.
    This value should correspond with an `Advisor.email` value in the Data Hub backend
    
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
    yarn install
    ```

5.  Create a copy of a sample `.env` file which points to a mocked API:
 
    ```bash
    cp sample.env .env
    ```
    
    See [supported environment variables](#environment-variables).
   
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

### Updating NodeJs
When NodeJs is updated it is worth noting it needs to be updated in a few places:

#### Cloud foundry build pack
Please update the build pack in `manifest.yml` to use the required [cloud foundry build pack release](https://github.com/cloudfoundry/nodejs-buildpack/releases).
Once this is done you can then choses the node version for the next steps.

#### Engines package.json
Engines in `package.json` needs updating:
```
  "engines": {
    "node": "<node_version>"
  },
```

#### Version inside .nvmrc
Default node version for `nvm` is defined inside .nvmrc. Update by running:
```
  echo "v8.15.1"  > .nvmrc
```

#### CircleCi config
The value used in `.circleci/config.yaml` needs updating:
```
  - &node_version   <node_version>
```

#### Data hub base docker
The version of the NodeJs docker that is used in our CircleCi Acceptance tests jobs needs to be updated in
[uktrade/docker-data-hub-base](https://github.com/uktrade/docker-data-hub-base). You will also need to wait for the
[docker automated build](https://hub.docker.com/r/ukti/docker-data-hub-base/builds/) to finish.

### OAuth
Data hub uses [uktrade/staff-sso](https://github.com/uktrade/staff-sso) for OAuth. Details of the required environment
variables needed to setup OAuth can be seen in the [Environment variables](#environment-variables) section.
For further information about how to setup OAuth:
- Look in confluence for details on setting up SSO for developers. Instructions can be found in
  `Data Hub team > Technical Documentation > Frontend > SSO for developers`.

#### Bypassing OAuth in development mode
If you wish to completely bypass SSO functionality locally you can by setting the environment variable:
```
export OAUTH2_BYPASS_SSO=true
```
and providing a valid `OAUTH2_DEV_TOKEN` environment variable. This Access token needs to be valid for the SSO provider
the application is pointed at.

#### Using SSO when developing
Developers can also test SSO functionality locally by removing the `OAUTH2_DEV_TOKEN` environment variable and making
sure that `OAUTH2_BYPASS_SSO` is set to false (it is by default). To use Oauth locally you will then need to set up the
correct access and SSO details for the SSO provider you are using.

##### SSO development providers

###### SSO mock
You could use the [uktrade/mock-sso](https://github.com/uktrade/mock-sso) repo.

If you are using docker-compose and the supplied `sample.env` file, the default
environment variables will suffice.  Run through the instructions to [set up
mock-sso under docker-compose here](https://github.com/uktrade/mock-sso#docker-compose).

If you are running natively, you will need to set up the following environment variables:
```
export OAUTH2_DEV_TOKEN=exampleDevToken
export OAUTH2_TOKEN_FETCH_URL=http://localhost:8080/o/token
export OAUTH2_AUTH_URL=http://localhost:8080/o/authorize
```
data-hub-frontend will then use mock-sso to simply pass your `OAUTH2_DEV_TOKEN` between SSO and the application.

###### UAT SSO
You could point data-hub-frontend to the UAT SSO environment. If you wish to please speak to the
[#technology-sso](https://ditdigitalteam.slack.com/messages/C5FLP2DSM/details/) team to set up the correct access and
SSO details required.

### HTTP Basic Auth
When running with `OAUTH2_BYPASS_SSO` the frontend can be user/password protected by setting `BASIC_AUTH_USER` and `BASIC_AUTH_PASSWORD`

###### Local checkout of staff SSO
You could checkout [uktrade/staff-sso](https://github.com/uktrade/staff-sso) locally and point data-hub-frontend
at that.

### Other Scripts

The [package.json](./package.json) file includes a number of useful scripts
for other tasks.

Run BDD tests using Mocha:

```
yarn run test
```

Lint both SASS and JS to make sure it conforms to rules:

```
yarn run lint
```

## Making changes

See the [contributing guide](./CONTRIBUTING.md).

## Components

This app includes support for including components using a custom [nunjucks
tag](https://mozilla.github.io/nunjucks/api.html#custom-tags). This method
allows components to be available in all layouts, views, includes and macros
and allows each component to be a separating entity which makes maintaining
and testing them easier.

To include a component with its default state or one that expects no data:

```njk
{% component 'person' %}
```

To include a component and pass data to it:

```njk
{% component 'person', {
  name: 'Barry',
  age: '55'
} %}
```

Component can take multiple arguments. It will combine them in single object:

```js
res.render('some-page', {
  personData: {
    name: 'Barry',
    age: 55
  }
})
```
```njk
{% component 'person', personData, gender='male' %}
```

Is the same as:

```njk
{% component 'person', {
  name: 'Barry',
  age: '55',
  gender: 'male'
} %}
```

## Templates

Templates use Nunjuck's [template inheritance](https://mozilla.github.io/nunjucks/templating.html#template-inheritance).
There are several top level blocks which are used for injecting content during rendering. Each subsequent template
that extends the base layout can include these additional blocks.

### Nunjucks base template blocks

Template block names are structured by combining main element names to form path. e.g. `head` wraps everything inside
the `head` element, the same applies to `headIcons`.

- `_layouts/template.njk extends govuk-frontend/template.njk` - the GOV.UK frontend template Data Hub extends from

```<head>```

  - `pageTitle` - contains the page title
  - `headIcons` - contains various GOV.UK icons
  - `head` - overridden by Data Hub containing mainly `<meta>`, `<link>` and `<script>` tags

```</head>```

```</body>```

  - `bodyStart` - contains Google Tag Manager (GTM) and the notification banner
  - `skipLink` - a GOV.UK "skip to content" link
  - `header` - overridden by Data Hub
     - `header_site_title` - wraps the site title
     - `header_menu` - wraps the header menu
     - `local_header` - wraps header content specific to the app
  - `main` - Data Hub overrides the GOV.UK main block
     - `content` - overridden by Data Hub
        - `local_nav` - wraps navigation specific to the app
        - `body_main_content` - contains main content (inside main#content)
  - `footer` - contains a GOV.UK footer which DataHub overrides with an empty block
  - `bodyEnd` - initialise scripts (e.g. app.js and GOV.UK frontend)

```</body>```

### Base template variables

Base layout checks for certain variables.

- `siteTitle` {string} - name of the site. Defaults to 'Department for International Trade'.
- `serviceTitle` {string} - name of the service.
- `phaseBanner` {boolean} - whether to show the separate phase banner or default to phase tag in the global header. Possible values: `true` and `false`.
- `projectPhase` {string} - phase of the project. Possible values: `alpha` and `beta`.

## Testing

### Functional Testing

The aim of this test suite is perform functional tests of frontend components in isolation.

#### Setup

Pre-requisites:

Ensure you have [node](https://nodejs.org/en/download/) v8 installed then install dependencies:

`$ npm install`

#### Coding standards

StandardJS will run as part of the build, assure you run the command below before committing:

`$ npm run lint`

#### Running the tests

Notice that before running the tests the application should be up and running.

By default cypress will run on electron headlessly, you can read more about it [here](https://docs.cypress.io/guides/core-concepts/launching-browsers.html#Electron-Browser)

Execute all the tests on `specs` in chrome browser:

`$ npm run test:functional -- --browser chrome`

#### Running the tests manually in cypress interface

`$ npm run test:functional:watch`

#### Running a specific spec

`$ npm run test:functional -- --spec test/functional/cypress/specs/nav-spec.js`

### Acceptance Testing
Data hub uses [Nightwatch.js](http://nightwatchjs.org), [nightwatch-cucumber](https://github.com/mucsi96/nightwatch-cucumber) and [cucumber.js](https://github.com/cucumber/cucumber-js) to run acceptance tests.

#### Running acceptance tests
For information on [cucumber-js](https://github.com/cucumber/cucumber-js) tags please see the `nightwatch-cucumber` docs [executing-individual-feature-files-or-scenarios](http://mucsi96.github.io/nightwatch-cucumber/#executing-individual-feature-files-or-scenarios)

#### Running tests with specific user permissions
To run tests against a specific user permissions type:
- Change your `OAUTH2_DEV_TOKEN` environment variable to use one of:
  - `lepStaffToken`
  - `daStaffToken`
  - `ditStaffToken`
  - `policyFeedbackStaffToken`
- Use the relevant `yarn` script `yarn circle:acceptance:<staff type>` (see [package.json](/package.json))

##### Dev api tokens
The above permissions tokens are available on the dev api

##### Backend locally with user permission tokens
If you are running the api locally please run the [https://github.com/uktrade/data-hub-leeloo/blob/develop/setup-uat.sh](https://github.com/uktrade/data-hub-leeloo/blob/develop/setup-uat.sh) to setup the relevant users and permission tokens

##### Adding tokens
If you need to add a token have a look in confluence on how to do this `Data Hub team > Technical Documentation > Frontend > SSO for developers > Adding an Access token`.

You run acceptance tests via:
```
yarn test:acceptance
```

You can run a group (folder) of tests via:
```
yarn test:acceptance -- --group <folder-name>
```
e.g:
```
yarn test:acceptance -- --group audit
```

You can run a specific feature via:
```
yarn test:acceptance -- --tag <feature-tag>
```
e.g:
```
yarn test:acceptance -- --tag audit-company--name
```

You can also run the tests pointing to browserstack.
Ensure you have the user and access key in your environment variables.
You can find the browserstack credentials which lead to the info below on Rattic.
e.g:
```
BROWSERSTACK_USERNAME=username
BROWSERSTACK_ACCESS_KEY=accesskey
```

Then run:
```
REMOTE_RUN=true yarn test:acceptance:remote --env ie11,firefox --tag audit-company--name
```

If you don't want to install Java and selenium locally you can run them in a docker container:

```
docker run -d -p 4444:4444 selenium/standalone-chrome:3
```

Then run:
```
NIGHTWATCH_IN_DOCKER=true yarn test:acceptance
```

#### Naming conventions
##### Folders
We use singular or plural folder names. E.g `contacts`, `companies`, `audit`.

##### Filenames

We use singular names
- `page-object` names with PascalCase case. E.g `Login`, `Contact`, `ContactList`.
- `step_definitions` names with Kebabcase case. E.g `login`, `contact`, `company`.
- `feature` names with Kebabcase case. E.g `create`, `login`, `list`.

##### Feature tags
We name features after the folder name and file name. So `/auth/login.feature` would have the feature tag `@auth-login`


##### Scenario tags
We name scenarios after the feature name with a double hyphen separating the scenarios tag. So a scenario in the `@auth-login` feature would be `@auth-login--logout`

##### Permissions tags
To run a scenario against a specific type of user you can use the following tags:
- `@da` will run the test against a user with `da` permissions
- `@lep` will run the test against a user with `lep` permissions

#### Ignoring features
You can tell `nightwatch.js` not to run a feature by adding the tag `@ignore`.


## Continuous Integration
Data hub uses [CircleCI](https://circleci.com/) for continuous integration.

### Running CI jobs
- All branches run the `lint_code`, `unit_tests` and `user_acceptance_tests` CI jobs
- You can skip the `user_acceptance_tests` CI job by using a branch starting with `/^skip-tests.*/`
- The `user_acceptance_tests_master` job will run on branches that match the regex `release.*` or the `master` branch. This job runs a branch against the `master` branch of [data-hub-leeloo](https://github.com/uktrade/data-hub-leeloo/tree/master)

### Setting up users with different permissions
On CircleCi we run Acceptance tests against users with different permissions. We do this via the environment variable `OAUTH2_DEV_TOKEN`. Essentially we have users with different permissions setup in a job via `OAUTH2_DEV_TOKEN` and then we run tests with the specified permissions tag.
So for setting up a test for a user of type `LEP` you need to:
- add a token to the backend with a token associated to the permissions type. e.g `lepStaffToken`
- add this token to the environment variable `OAUTH2_DEV_TOKEN` in the circleCi job
- write a permission test and specify a tag in the cucumber feature. e.g `@lep`
- specify which tag to use when running `nightwatch`. e.g `npm run circle:acceptance --  --tag lep`

### Base docker image
The acceptance tests `user_acceptance_tests` job uses the docker image `ukti/docker-data-hub-base` as a base for running a selenium server and data hub frontend
Details can be found in the [GitHub](https://github.com/uktrade/docker-data-hub-base) and [docker](https://hub.docker.com/r/ukti/docker-data-hub-base/) repositories.

### Data hub backend docker image
The acceptance tests `user_acceptance_tests` job on circleCi uses its own version of [uktrade/data-hub-leeloo](https://github.com/uktrade/data-hub-leeloo).
The `uktrade/data-hub-leeloo` docker image and tags that is used is automatically built via a Docker hub automated job. Details can be found [https://hub.docker.com/r/ukti/data-hub-leeloo](https://hub.docker.com/r/ukti/data-hub-leeloo).

- `user_acceptance_tests` job uses `ukti/data-hub-leeloo:latest`
- `user_acceptance_tests_master` job uses `ukti/data-hub-leeloo:master`

### Mock SSO docker build
The acceptance tests `user_acceptance_tests` job on circleCi uses [uktrade/mock-sso](https://github.com/uktrade/mock-sso)
to run the application through the SSO workflow. The `uktrade/mock-sso` docker image and tag that is used is
automatically built via a Docker hub automated job. Details can be found [https://hub.docker.com/r/ukti/mock-sso](https://hub.docker.com/r/ukti/mock-ssoo).

- `user_acceptance_tests` job uses `uktrade/mock-sso:latest`
- `user_acceptance_tests_master` job uses `uktrade/mock-sso:latest`

### Job failure
CircleCI has been configured to show you a summary report of what has failed on the following workflows:
- `unit_tests`
- `lint_code`
- `user_acceptance_tests`

When acceptance tests fail you can also have a look at the `Nightwatch.js` html report found in the jobs artifacts folder.
This can be accessed by logging in to [CircleCI](https://circleci.com/)

## Visual Testing

The aim of this suite is taking screenshots from pages and comparing to baselines
to ensure consistency between builds.

### Folder structure

Screenshots will be stored in the root of the project. We commit the baselines and ignore the comparison diff images. If we need to update the baseline screenshot we need to delete the old baseline and rerun the test (it will then copy the new screenshot saved in comparison folder into the baseline folder)

```
- visual-screenshots
  - baseline
  - comparison
  - diff
```

### Browserstack environment variables

to run in browserstack, ensure you have the following environment variables set:

```
export BROWSERSTACK_USERNAME=xxx
export BROWSERSTACK_ACCESS_KEY=xxx
export IS_REMOTE=true
```
### Running the tests
After setting up the environment variables, run the following command to execute the tests:

`$ yarn test:visual`

### Updating the baseline image

Currently updating the baseline imagine is a manual process. Once you confirm the comparison image
is how the application should look like, delete the baseline for the particular test case, and rerun
the visual test suite. Once it reruns, it will notice there is a baseline image missing and use the 
freshly screenshot taken as the current baseline.

Baseline image filename and path should look something like this:

`~/visual-screenshots/baseline/Data Hub core pages should visually check data hub home page is correct - chrome`

## Deployment

Commits to `develop` are automatically deployed to a heroku instance. Pull
requests deploy to a [review app](https://devcenter.heroku.com/articles/github-integration-review-apps)
from this heroku instance.

Deployments to staging and production are done manually through Jenkins and are
deployed from the `master` branch.
