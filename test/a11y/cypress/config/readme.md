# Cypress A11y Accessibility Testing

> “a11y” stands for “accessibility.” It is a _numeronym_, with 11 representing the count of letters between the letter a and the letter y.

## Running the Tests in the Browser

To run the tests first ensure any locally running instances of the application are stopped and that the .env file used to run sandbox is used. Start 4 terminal sessions to for the following instructions.

1. redis-server
2. cd test/sandbox && npm install && npx nodemon .
3. npm run develop
4. npm run test:a11y:watch
5. run the test all-accessibility.spec.js

This will open Cypress in the browser. At the time of writing when the browser opens select **E2E Testing** and then start E2E testing in the browser of your choice.
Find all-accessibility.spec.js and run this test.

Alternatively for step 4. run **npm run test:a11y** to run the tests in the console.

## Configuration

The files needed for the integration of A11y accessibility tests can be found in **test/a11y/cypress/config**.
There is a single test file all-accessibility.spec.js found in **test/a11y/cypress/specs** that will iterate through **src/lib/urls.js**.

Functionality is contained in the **utils.js** file. The first function flattens the urls within urls.js and the second cleanses this list and puts it in to a usable format.

Identification numbers such as companyId and countryId are accessed from **testIdentityNumbers.js**.

Any urls entered in **urlTestExclusions.js** are excluded from testing. This includes pages that currently have A11y issues, pages that return a 404 in the sandbox environment and pages that doe not resolve because sandbox or faker data is not currently configured.

If you have failing **a11y_tests** in Circle CI following changes it's possible your page has genuine accessibility issues. If this is not the case and the url needs to be excluded. Open **urlTestExclusions.js** and add the url to the array under the appropriate heading within the array i.e. A11y errors, 404 errors and or no sandbox data available, Excluded urls. All metadata urls are also excluded here

Data, Export data points are excluded as a default.

New tests will automatically appear when added to **src/lib/urls.js**.

## 🧩 Component Accessibility Testing

Component-level a11y tests are also supported.

These tests are located in: test/a11y/cypress/specs/component/

To run component tests in GUI mode (console):

```bash
npx cypress open --component --config-file=cypress.a11y.config.js
```
When the Cypress UI opens, choose Component Testing, then select a test under the component/ directory.

To run component tests in headless mode (console):

```bash
npx cypress run --component --config-file=cypress.a11y.config.js
```