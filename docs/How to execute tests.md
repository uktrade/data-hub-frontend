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

Updating the baseline consists in 2 steps:

- 1:. Run the visual tests on your machine, if the baseline is no longer the correct representation of the page in test then execute step #2:

- 2:. Run `wdio-image-diff -u` this will copy the comparison images over to the baseline folder, updating any baseline image that is no longer valid.
