# Data Hub frontend

An express application that fetches data from a back end JSON based api and renders it to the screen.
This front end layer is primarily turning requests from the browser into back end API calls and then
rendering them using Nunjucks template language.

The client layer applies the ideals of progressive enhancement so that a wide range of devices can
access it, no matter what their limitation.

In order to use the application the front end layer must be run, with a small number of settings,
and be provided with a back end server to provide the API, data storage and search engine capabilities.

## Table of Contents
- [Getting started](#getting-started)
  - [Docker](#docker)
    - [docker-compose.yml](#docker-composeyml)
    - [Environment Variables](#environment-variables)
  - [Native install](#native-install)
    - [Dependencies](#dependencies)
  - [Installation](#installation)
    - [Run in production mode](#run-in-production-mode)
    - [Run in development mode](#run-in-development-mode)
  - [Other Scripts](#other-scripts)
- [Making changes](#making-changes)
- [Components](#components)
- [Templates](#templates)
  - [Nunjucks base template blocks](#nunjucks-base-template-blocks)
  - [Base template variables](#base-template-variables)
  - [Template inheritance diagram](#template-inheritance-diagram)
- [Testing](#testing)
  - [Acceptance Testing](#acceptance-testing)
    - [Running acceptance tests](#running-acceptance-tests)
    - [Naming conventions](#naming-conventions)
      - [Folders](#folders)
      - [Filenames](#filenames)
      - [Feature tags](#feature-tags)
      - [Scenario tags](#scenario-tags)

    - [Ignoring features](#ignoring-features)
- [Continuous Integration](#continuous-integration)
  - [Docker image](#docker-image)
  - [Job failure](#job-failure)
- [Deployment](#deployment)


## Getting started

### Docker

The project comes with docker compose files, this means if you have docker you can start
the app with a single command.

There are 2 docker files.

#### docker-compose.yml

This will run the front end server locally, but will point to a remote backend.
This file expects the following environment variables:

| Name | Description |
|:-----|:------------|
| API_ROOT | The url for a back end server instance for the service |
| POSTCODE_KEY | Part of the frontend looks up addresses for postcodes using [getaddress.io](https://getaddress.io/). Obtain a key for the service and set it here |
| API_CLIENT_ID | Half the credentials needed to talk to the back end |
| API_CLIET_SECRET | The second half of the credentials needed to talk to the backend |
| GOOGLE_TAG_MANAGER_KEY | The key needed to integrate with google tag manager to track usage |
| REDIS_HOST | You need to run redis and provide the host name for it here unless you specify the entire url |
| REDIS_URL | A full length url to conenct to redis |
| REDISTOGO_URL | Probably for use with heroku |
| ASSETS_HOST | Optional host for assets CDN, defaults to app’s host |
| ZEN_TOKEN | Zendesk auth token |
| ZEN_DOMAIN | Domain used on Zendesk |
| ZEN_EMAIL | Zendesk email address |
| ZEN_BROWSER | Zendesk browser ID |
| ZEN_IMPACT | Zendesk impact ID |
| ZEN_SERVICE | Zendesk service ID |
| SENTRY_DSN | Sentry DSN (optional) |
| WEBPACK_ENV | Optionally select the webpack configuration variation to use, the default will correctly pick a production or development config based on NODE_ENV. Valid values include `prod`, `develop` and `docker` |

Either set these variables manually or why not look at [autoenv](https://github.com/kennethreitz/autoenv).
To start the server just:

    docker-compose up

The server starts in developer mode, which means that when you make local changes it will auto-compile
sass or javavscript, and will restart nodejs when server side changes are made. A container with redis will also start, this is linked to the data hub container.

You can access the server on port 3000, [http://localhost:3000](http://localhost:3000). You can also run
a remote debug session over port 5858 if using webstorm/Intellij or Visual Studio Code

#### Environment Variables
Docker Compose [supports declaring default environment variables](https://docs.docker.com/compose/environment-variables/#the-envfile-configuration-option) in an environment file. If you wish to send through environment variables to the docker containers please add them into the `.env` file in the projects root.

### Native install

#### Dependencies

* [Node.js](https://nodejs.org/en/) (>= 8.0.0)
* [Yarn](https://yarnpkg.com/en/docs/install) (>= 0.23.4)
* [Redis](https://redis.io/)

The project is using ES6 async/await therefore Node 8 is required.

### Installation

1. Clone repository and change directory:

   ```
   git clone https://github.com/UKTradeInvestment/data-hub-frontend && cd data-hub-frontend
   ```

2. Install node dependencies:

   ```
   yarn install
   ```

3. Create a copy of the sample .env file and add values for the keys
   (a current member of the project team can give you these):

   ```
   cp sample.env .env
   ```

4. Run an instance of Redis and change `REDIS_HOST` and `REDIS_PORT` in your
   .env file if necessary

#### Run in production mode

Builds static assets and runs a server using node

```
yarn run build && yarn start
```

#### Run in development mode

Server watches for changes and rebuilds sass or compiles js using webpack as
needed. Changes to server side code will result in the server autorestarting.
The server will run with the node debug flag so you can debug with Webstorm
or Visual Studio Code.

```
yarn run develop
```

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
the `head` element, `head_content` wraps the section that is used to contain contents of `head` element. Thus allowing
to completely override everything inside `head` element if needed or just the section reserved for basic use cases.    

- `head` - contains the whole head element
  - `head_title_content` - contains title element content
  - `head_content` - wraps main content for head element
  - `head_stylesheets` - wraps stylesheet declarations
- `body` - contains the whole body element
  - `body_skiplinks` - wraps container with "skip to content" link (first element inside body)
  - `body_notifications` - wraps cookie message container (above site_header, after skiplinks)
  - `body_site_header` - wraps site header
    - `header_site_title` - wraps the site title
    - `header_menu` - wraps the header menu
  - `body_main` - wraps the main content block
    - `body_main_header` - contains the header of the main block
    - `body_main_header_content` - contains the heading of the main block
    - `body_main_content` - contains main content (inside main#content)
  - `body_footer` - wraps site footer container (inside body > footer)
  - `body_footer_content` - contains content inside site footer

### Base template variables

Base layout checks for certain variables.

- `siteTitle` {string} - name of the site. Defaults to 'Department for International Trade'.
- `serviceTitle` {string} - name of the service.
- `phaseBanner` {boolean} - whether to show the separate phase banner or default to phase tag in the global header. Possible values: `true` and `false`.
- `projectPhase` {string} - phase of the project. Possible values: `alpha` and `beta`.

### Template inheritance diagram

```
layouts/

    +-> dit-base.njk
    |
+-> +-+ datahub-base.njk <-----+
|                              |
| +++-> _base-two-column.njk +-+
| |||
| |||   contact/
| |||
| ||+---+ _layout.njk <--------+
| ||                           |
| ||      details.njk +--------+
| ||
| ||    company/
| ||
| |+-----+ _layout-edit.njk <--+
| |                            |
| +------+ _layout.view.njk <-+|
|                             ||
|           details-ltd.njk +-+|
|                              |
|           edit-ltd.njk +-----+
|
+-----+ login.njk
```

## Testing

### Acceptance Testing
Data hub uses [Nightwatch.js](http://nightwatchjs.org), [nightwatch-cucumber](https://github.com/mucsi96/nightwatch-cucumber) and [cucumber.js](https://github.com/cucumber/cucumber-js) to run acceptance tests.

#### Running acceptance tests
For information on [cucumber-js](https://github.com/cucumber/cucumber-js) tags please see the `nightwatch-cucumber` docs [executing-individual-feature-files-or-scenarios](http://mucsi96.github.io/nightwatch-cucumber/#executing-individual-feature-files-or-scenarios)

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


#### Ignoring features
You can tell `nightwatch.js` not to run a feature by adding the tag `@ignore`.


## Continuous Integration
Data hub uses [CircleCI](https://circleci.com/) for continuous integration. 

### Docker image
The acceptance tests use the docker image `ukti/docker-data-hub-base` 
Details can be found in the [GitHub](https://github.com/uktrade/docker-data-hub-base) and [docker](https://hub.docker.com/r/ukti/docker-data-hub-base/) repositories.

### Job failure
CircleCI has been configured to show you a summary report of what has failed on the following workflows:
- `unit_tests`
- `lint_code`
- `acceptance_tests`

When acceptance tests fail you can also have a look at the `Nightwatch.js` html report found in the jobs artifacts folder. 
This can be accessed by logging in to [CircleCI](https://circleci.com/)

## Deployment

Commits to `develop` are automatically deployed to a heroku instance. Pull
requests deploy to a [review app](https://devcenter.heroku.com/articles/github-integration-review-apps)
from this heroku instance.

Deployments to staging and production are done manually through Jenkins and are
deployed from the `master` branch.
