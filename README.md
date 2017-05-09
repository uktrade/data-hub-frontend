# Data hub Beta 2

An express application that fetches data from a back end JSON based api and renders it to the screen.
This front end layer is primarily turning requests from the browser into back end API calls and then
rendering them using Nunjucks template language.

The client layer applies the ideals of progressive enhancement so that a wide range of devices can
access it, no matter what their limitation.

In order to use the application the front end layer must be ran, with a small number of settings,
and be provided with a back end server to provide the API, data storage and search engine capabilities.

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
| GOOGLE_TAG_MANAGER | The key needed to integrate with google tag manager to track usage |
| REDIS_HOST | You need to run redis and provide the host name for it here unless you specify the entire url |
| REDIS_URL | A full length url to conenct to redis |
| REDISTOGO_URL | Probably for use with heroku |
| ZEN_TOKEN | Zendesk auth token |
| ZEN_DOMAIN | Domain used on Zendesk |
| ZEN_EMAIL | Zendesk email address |
| ZEN_BROWSER | Zendesk browser ID |
| ZEN_IMPACT | Zendesk impact ID |
| ZEN_SERVICE | Zendesk service ID |

Either set these variables manually or why not look at [autoenv](https://github.com/kennethreitz/autoenv).
To start the server just:

    docker-compose up

The server starts in developer mode, which means that when you make local changes it will auto-compile
sass or javavscript, and will restart nodejs when server side changes are made.

You can access the server on port 3000, [http://localhost:3000](http://localhost:3000). You can also run
a remote debug session over port 5858 if using webstorm or Visual Studio Code

### Native install

#### Dependencies

* [Node.js](https://nodejs.org/en/) (>= 6.9.1)
* [Yarn](https://yarnpkg.com/en/docs/install) (>= 0.23.4)
* [Redis](https://redis.io/)

### Installation

1. Clone repository and change directory:

  ```
  git clone https://github.com/UKTradeInvestment/data-hub-fe-beta2 && cd data-hub-fe-beta2
  ```

1. Install node dependencies:

  ```
  yarn install
  ```

1. Create a copy of the sample .env file and add values for the keys.
   A current member of the project team can give you these.

  ```
  cp sample.env .env
  ```

1. Run an instance of Redis

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

## Deployment

Changes to `develop` and `master` are auto deployed to staging and production
environments on Heroku.
