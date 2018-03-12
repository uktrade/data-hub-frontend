# Data Hub frontend

[![Greenkeeper badge](https://badges.greenkeeper.io/uktrade/data-hub-frontend.svg)](https://greenkeeper.io/)
[![CircleCI](https://circleci.com/gh/uktrade/data-hub-frontend.svg?style=svg)](https://circleci.com/gh/uktrade/data-hub-frontend)
[![Dependency Status](https://gemnasium.com/badges/github.com/uktrade/data-hub-frontend.svg)](https://gemnasium.com/github.com/uktrade/data-hub-frontend)

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
- [Continuous Integration](#continuous-integration)
  - [Running CI jobs](#running-ci-jobs)
  - [Setting up users with different permissions](#setting-up-users-with-different-permissions)
  - [Base docker image](#base-docker-image)
  - [Data hub backend docker image](#data-hub-backend-docker-image)
  - [Mock SSO docker build](#mock-sso-docker-build)
  - [Job failure](#job-failure)
- [Deployment](#deployment)
- [Git Usage](#git-usage)
  - [GitFlow](#gitflow)
  - [Jira integration](#jira-integration)
  - [Commit message](#commit-message)
  - [Rebasing](#rebasing)
  - [Fixup](#fixup)
  - [Naming Commits and PRs](#naming-commits-and-prs)
  - [Cheat-sheet](#cheat-sheet)


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
| ARCHIVED_DOCUMENTS_BASE_URL | The url for the archived documents store |
| ASSETS_HOST | Optional host for assets CDN, defaults to app’s host |
| BASIC_AUTH_USER | Optional. If running a server with OAUTH2_BYPASS_SSO=true then this can be used in conjunction with a password to setup basic HTTP auth to protect the server |
| BASIC_AUTH_PASSWORD |  Used in conjunction with BASIC_AUTH_USER to setup security for the server |
| CI | Set to true for UAT testing, otherwise ignore |
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
| ZEN_BROWSER | Zendesk browser ID |
| ZEN_DOMAIN | Domain used on Zendesk |
| ZEN_EMAIL | Zendesk email address |
| ZEN_IMPACT | Zendesk impact ID |
| ZEN_SERVICE | Zendesk service ID |
| ZEN_SERVICE_CHANNEL | The Zen channel name for the service - defaults to `datahub` |
| ZEN_TOKEN | Zendesk auth token |


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
variables needed to setup OAuth can be seen in the [Environment Variables](#environment-variables) section.
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
You could use the [uktrade/mock-sso](https://github.com/uktrade/mock-sso) repo. You will need to set up the following 
environment variables:
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

#### Running tests with specific user permissions
To run tests against a specific user permissions type: 
- Change your `OAUTH2_DEV_TOKEN` environment variable to use one of: 
  - `lepStaffToken`
  - `daStaffToken`
  - `ditStaffToken`
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

## Deployment

Commits to `develop` are automatically deployed to a heroku instance. Pull
requests deploy to a [review app](https://devcenter.heroku.com/articles/github-integration-review-apps)
from this heroku instance.

Deployments to staging and production are done manually through Jenkins and are
deployed from the `master` branch.

## Git usage

### GitFlow

We follow GitFlow as a model. See [the original post for details](http://nvie.com/posts/a-successful-git-branching-model/)
but basically:

1. When working on a feature start a feature branch by branching off of `develop`
2. Prefix your branch name with `feature/`, `bugfix/` or `documentation/` and also with the id of the Jira ticket `DH-1234` as described [below](#jira-integration) 
3. Add your commits to that using the adequate [commit messages](#commit-message)
4. When you think it's finished raise a pull request against develop
5. When that's approved do the rebase shuffle described [below](#rebasing-and-merging) and merge it
6. Releases are normally created simply by merging develop into master as PR, although there is always the option of creating a release branch as GitFlow describes

### Jira Integration
As per official [Atlassian Support documentation](https://confluence.atlassian.com/adminjiracloud/connect-jira-cloud-to-github-814188429.html) When your GitHub account is linked to Jira Software, your team gets to see their branches, commit messages and pull requests right in the context of the Jira Software issues they're working on.

In order to keep Jira in sync with GitHub, you will need to add the Jira Id as a prefix to your branch name,
`bugfix/DH-5678-my-branch-with-goodies`,
 and you can also track commits by including the Ticket Id in your commit message  

```
DH-5678 Very important fixes for the really big issue
that regresses every time another important fix is added somewhere else.
Fixed it by using a houndstooth pattern for the FooBar class
```

Jira Id's in commit messages come in handy especially when debugging legacy functionality,
as it links the developer with the specific story, bug, and epic, making it much easier for you and your team to access 
more detailed information that can't be condensed in a commit message (e.g. acceptance criteria, user stories, responsible 
stake holder contact details, etc). 

### Rebasing

We use a process of squashing commits and rebasing on top of the current head of develop.
The goal is that all commits neatly describe what they do and there's no visual noise.

Consider a series of commits that look like this:

```
Really big important feature
Oops, typo stopped build working
Ah. Typo was actually intentional, restoring it
Fix for a thing I forgot about
Another really big and important feature
```
Someone trying to figure out what your changes do will quickly become baffled by changes
in commits with not particularly helpful titles. The ideal would be something like this:

```
Adds really big important feature
Adds another really big and important feature
```

 ## Fixup
So how do you deal with typos and minor tweaks? Enter our friend [fixup](https://git-scm.com/docs/git-commit#git-commit---fixupltcommitgt).
If you add a commit that modifies a previous commit you write `git commit --fixup <hash>` where hash is the
identifier of the commit you want to modify.

If you look at your git log  it will look something like this

```
Adds a really big important feature
!fixup Adds a really big important feature
```

You can add as many fixups as you want. They don't even need to be for the immediately
preceding commit.

```
Adds a really big important feature
!fixup Adds a really big important feature
Adds a different feature that is related to the PR
```

When you create a PR run this command and git will magically squash the
fixups into their original commits ```git rebase -i —autosquash <hash>```
- **very important**: the hash reference here has to be the commit immediately
_before_ the commit you want to have fixups merged into. Things like ```HEAD^10```
should work as well.

If you've been pushing to the github remote while working on your changes
you'll almost definitely need to add the ```--force``` option to ```git push```
to get the new history into Github.

So what happens if you try to merge a PR with fixups in? You can't! One of our
developers wrote a very useful little service that inspects PRs and blocks
ones with unsquashed fixups.

Once a PR has been approved, all its tests are green, and all fixups have been squashed
you merge onto the _head_ of develop. Steps:

1. Check out develop
2. ```git pull```
3. Check out your branch
4. ```git rebase develop```
5. Now push and merge your PR

### Naming commits and PRs

Commit titles should be succinct and say what that particular commit is
trying to do. Like so:

```
Adds a polka dot style for buttons
Refactors tests into separate module
Deletes duplicate and unused code
```
That kind of forces the idea that commits should be atomic (and fixup, as
described above helps this process). You can put extra detail in the body
of the message.

We try to use the rules described in [this article](https://web-design-weekly.com/2013/09/01/a-better-git-commit/)
but the tl;dr is: titles less than 50 characters, bodies wrapped at 72.

PRs **must** contain the Jira ticket reference as the first part of the title
of the PR if it's in any way related to a story.
The reason for this is twofold: one is that we have integration
between Github and Jira, so you can track the actual software changes
from inside Jira, which is nice; secondly, it makes creating release notes
that are consumed by the project management side of the team way easier.

So a PR would look something like this:

**Title**: DH-1234 Polka dot styling for buttons
**Body**: this PR introduces a new style for buttons in the product.
The style is applicable by adding a class of ```.polkadot``` to
any element that needs it.

Obviously if a change isn't related to a ticket, such as someone doing a dependency update chore,
then this isn't necessary.

### Cheat sheet

#### GitFlow
##### Branching
```
# 1st make sure you're on the develop branch
git checkout develop

# then create a new branch
git checkout -b feature/DH-1234-descriptive-branch-title-goes-here
```
##### Committing
Avoid using the `-m` commit flag 
~~git commit -m "A blurry commit message"~~ and use `git commit` with no flags.

Your commit should look something like this:
```
Clearly explain in one line what the commit is about

Describe the problem the commit solves. Justify why you chose
the particular solution. Reference the issue number if not
addressed in the title.
```

##### Rebasing
```
git rebase -i origin/develop
```

Vim will then open and you will need to update it as follow:
```
pick 1abcdefg A random Git commit message
squash 2gfabc1 Another useful git message
squash 3abcabc Yet again some important information
  
# Rebase ...
~                                            
```  

exit and save with `:wq!` or exit without sawing using `:q!` 
hit return, and follow the instructions,
and finally `git push origin feature/DH-4321-the-branch-you-are-on --force` 

##### Fixup

```
# major code changes
$ (dev) git add featureA
$ (dev) git commit -m "Feature A is done"
[dev fb2f677] Feature A is done

# small code tweaks
$ (dev) git commit --fixup fb2f677
[dev c5069d5] fixup! Feature A is done
ac5db87 Previous commit

$ (dev) git rebase -i --autosquash ac5db87
```


