## Setup

Pre-requisites:

Ensure you have [node](https://nodejs.org/en/download/) v8 installed then install dependencies:

`$ npm install`

## Coding standards

StandardJS will run as part of the build, assure you run the command below before committing:

`$ npm run lint`

## Running the tests

Notice that before running the tests the application should be up and running.

By default cypress will run on electron headlessly, you can read more about it [here](https://docs.cypress.io/guides/core-concepts/launching-browsers.html#Electron-Browser)

Execute all the tests on `specs` in chrome browser:

`$ npm run test --browser chrome`

## Running the tests manually in cypress interface

`$ npm run watch`

## Running a specific spec

`$ npm run test cypress/specs/company-filter-spec.js`

