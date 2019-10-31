### E2E Testing

The aim of this test suite is perform end to end tests, simulating a user flow.

#### Setup

Pre-requisites:

Ensure you have [node](https://nodejs.org/en/download/) v10 installed then install dependencies:

`$ npm install`

#### Running the tests

Notice that before running the tests the application should be up and running.

By default cypress will run on electron headlessly, you can read more about it [here](https://docs.cypress.io/guides/core-concepts/launching-browsers.html#Electron-Browser)

Execute all the tests on `specs` in chrome browser:

`$ npm run test:e2e -- --browser chrome`

#### Permission tags

If you'd like to run specific permission user tests, run one of the following commands below:

`$ npm run test:e2e:lep -- --browser chrome`

or

`$ npm run test:e2e:da -- --browser chrome`

#### Running the tests manually in cypress interface

`$ npm run test:e2e:watch`

#### Running a specific spec

`$ npm run test:e2e -- --spec test/end-to-end/cypress/specs/LEP/permission-spec.js`
