# Writing tests

When thinking about writing tests for your code, and what *type* of tests to write, it's worth thinking about a 'testing pyramid'. [This is a great article on how to apply the pyramid practically](https://martinfowler.com/articles/practical-test-pyramid.html). The TLDR is:

> 1. Write tests with different granularity
> 1. The more high-level you get the fewer tests you should have

Our current stack is more of a test 'ice cream cone' or inverted pyramid, and we're starting to see the friction that causes in development, with slow and resource-heavy automated tests.

The basic set to look at for TDD:
1. [Feature tests](#feature-specs)
1. [Component tests](#component-specs)
1. [Unit tests](#unit-tests)

Extra coverage, based on what's being tested or to be added after the work is complete:
1. [e2e tests](#end-to-end-e2e-tests)
1. [a11y tests](#a11y-tests)

## Test Layers 

Here's a bit of info on the current layers of testing in this app. 
 
### feature specs 

**framework:** Cypress

**what:** Testing the main happy and unhappy paths or user journeys. These specs are expensive because they build the entire app and render the code under test in Chrome, simulating a real user navigating the app, but pointing at the [Sandbox API rather than the real API](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Running%20tests.md#sandbox). 

This means they can be slow or flakey and require a fair bit of resources, but they are really useful for ensuring that the code works as a whole. 

One approach to TDD is first writing a minimal happy path in your feature spec and as you build up code you can write unit/component tests for new logic, then go back and refactor etc. If you've covered some logical branches in component or unit tests, then you don't need to also cover them in feature specs. 

**where:** in 'test/functional/cypress/specs/{folder}' folder and file name should reflect the code under test as much as possible.

**examples:** [events/collection-spec.js](https://github.com/uktrade/data-hub-frontend/blob/main/test/functional/cypress/specs/events/collection-spec.js)

**how to run:** [functional tests](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Running%20tests.md#functional-tests)

### component specs

**framework:** cypress

**what:** These tests can be used to render and test one component in isolation, so that the code around the entire app and data setup needed doesn't need to run, and only the logic under test is run. It also avoids duplicating tests for shared components across functional tests. E.g. for the `CompanyLists` component we can pass in the different mock data needed to test different cases, so then in any functional tests where that component appears we only need to check that we pass data into the component.

**examples:** [CompanyLists/Table.test.jsx](https://github.com/uktrade/data-hub-frontend/blob/main/test/component/cypress/specs/CompanyLists/Table.test.jsx) 

**how to run:** [component unit tests](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Running%20tests.md#component-unit-tests)

### unit tests

**frameworks:** Mocha, Sinon for stubbing/spying

**what:** For low-cost granular testing of specific functions/utilities. Capture edge cases or unhappy paths. Just runs the javascript so not for rendering components. Anything outside of the function under test should be mocked. 

**where:** As close to what's being under test as possible. e.g. in a __test__ folder on the same level. 

**examples:** date.test.js

**how to run:** [unit tests](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Running%20tests.md#unit-tests)

### controller tests

**framework:** Mocha, Sinon

**what:** As particular type of unit test for granular testing of controller functions in Express. Note: as we move away from using the controllers on Express and making all cals to an API these shouldn't be needed.

**examples:** [activity-feed/controllers.test.js](https://github.com/uktrade/data-hub-frontend/blob/main/src/apps/companies/apps/activity-feed/__test__/controllers.test.js)

**how to run:** [unit tests](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Running%20tests.md#unit-tests)

### end-to-end (e2e) tests

**framework:** Cypress

**what:** Testing the main integration points between the frontend and the API. These point to a ['real' version of the backend](https://github.com/uktrade/data-hub-frontend/blob/main/docker-compose.e2e.backend.yml) to make sure the contract between the two is correct for important user journeys - e.g. [creating a contact](https://github.com/uktrade/data-hub-frontend/blob/main/test/end-to-end/cypress/specs/DIT/contacts-spec.js). They can tricky to run locally and time consuming.  Read more about how [these are setup in the docs](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Running%20tests.md#e2e-tests).

**where:** `test/end-to-end/cypress` there are folders for the different user profiles

**examples:** [DIT/contacts-spec.js](https://github.com/uktrade/data-hub-frontend/blob/main/test/end-to-end/cypress/specs/DIT/contacts-spec.js

**how to run:** [e2e tests](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Running%20tests.md#e2e-tests)

### a11y tests

**framework:** Cypress, Axe

**what:** These tests run against the main routes of the app (e.g. `/events`) and use the [`cypress-axe` library](https://github.com/component-driven/cypress-axe) to ensure that the site meets standard accessibility requirements. We should  ideally create a new one for any new main collection page, or a form page with interactivity, but we don't have a consistent approach to this. There's also a [chrome extension](https://www.deque.com/axe/) that you can add to run manually on your work.

**where:** `test/a11y/cypress`

**examples:** [events/collection-spec.js](https://github.com/uktrade/data-hub-frontend/blob/main/test/a11y/cypress/specs/events/collection-spec.js)

**how to run:** [accessibility tests](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Running%20tests.md#accessibility-tests)
