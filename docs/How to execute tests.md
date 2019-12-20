### E2E Testing

The aim of this test suite is perform end to end tests, simulating a user flow.

#### Setup

Pre-requisites:

Ensure you have [node](https://nodejs.org/en/download/) v10 installed then install dependencies:

`$ yarn`

#### Running the tests

Notice that before running the tests the application should be up and running.

You will also need data hub api application started with the initial fixutres loaded. This can be done
by running `start-uat.sh` located on the root of the api repository.

The main e2e test suite is triggered by running the following command:

`$ yarn test:e2e:dit -- --browser chrome`

#### Permission tags

There are also 2 other test suites, which run permission specs against users that have particular
permissions for their roles, you can trigger these tests by running either of the commands below:

`$ yarn test:e2e:lep -- --browser chrome`

or

`$ yarn test:e2e:da -- --browser chrome`

#### Running the tests manually in cypress interface

`$ yarn test:e2e:watch`

#### Running a specific spec

`$ yarn test:e2e:dit -- --spec test/end-to-end/cypress/specs/DIT/local-nav-spec.js`


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

- 2:. Run `$ yarn test:visual:update` to update the failed tests with updated images of how the page in test should look like.
