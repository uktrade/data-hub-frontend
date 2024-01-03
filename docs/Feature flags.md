# Feature flags

There are two types of feature flags.

1. Environment flags. Set as one value across an environment.
1. User flags. These can be set on a user-by-user basis. Useful if you want to turn a feature on only for certain users to see it in different environments.

## Environment feature flags

To create a feature flag you just need to add one in Django and it will be added to a property called 'features' on `res.locals`.

1. When building locally log into your Django admin http://localhost:8000/admin/.
2. Under FEATURE FLAG, click "add" to create a new one, fill out the form and make sure you click "active".
3. Your feature flag will now be available as a property called 'features' within `res.locals`.
4. As this gets exposed to the view you can now toggle components on/off using conditions in your `.njk` files.
5. Once you are happy with your feature flag, ask for this flag to be added to environments such as staging and production.
6. Clean up afterwards :-)

## User feature flags

### Setting up the backend

1. Create the flag in Django admin - `{api}/admin/feature_flag/userfeatureflag/` -> 'Add User Feature Flag`
2. Add to user in Django admin - `{api}/admin/company/advisor/` select user, and scroll down to the bottom under the 'other' heading. You should be able to see your flag on the left hand column and add it to the user.

### Using Express middleware

1. Call the `userFeatures` middleware function with the name of your key (e.g. `userFeatures('user-contact-activities')`) directly before your controller function gets called in the router, e.g.:

```
router.get(
  '/',
  userFeatures('user-contact-activities'),
  renderInteractionsForEntity
)
```

2. Check the `res.locals.userFeatures` for your feature in the controller function, e.g.:

```
 isAventriFeatureOn: res.locals.userFeatures?.includes(
        'user-contact-activities'
      ),
    ...
```

### Using React

1. use the `CheckUserFeatureFlag` component to wrap the conditional logic you need . e.g.

```

<CheckUserFeatureFlag userFeatureFlagName="my-user-feature">
{(isFeatureFlagEnabled)
  => {isFeatureFlagEnabled && <MyNewComponent />}}
</CheckUserFeature />

```

## Adding feature flags in Sandbox

### Nunjucks feature flags

To add a feature flag in Sandbox for functional testing you just need to add your feature flag name to this JSON file: https://github.com/uktrade/data-hub-frontend/blob/main/test/sandbox/fixtures/v3/feature-flag/feature-flag.json .

### React feature flags

To add a React-built feature flag to Sandbox for testing, add it to the `active_features` array at the end of this JSON file: https://github.com/uktrade/data-hub-frontend/blob/main/test/sandbox/fixtures/whoami.json .

Alternatively, in Cypress, you can intercept and update the feature flag request, for example:

```
cy.intercept('GET', '/api-proxy/whoami', {
    active_features: ['your-flag-name'],
  })
```

### Flaky tests

The functional tests have the ability to turn on feature flags, usually seen like this:

```
before(() => {
  cy.setUserFeatures(['FEATURE_NAME'])
})
```

Whilst this enables the test currently being run to make some assertions about how the UI should display with that feature flag on, it will also enable that feature for every subsequent test as we are using a single sandbox api for all tests. To avoid this scenario, when using feature flags inside a test we need to use the Cypress `after` function like below to remove that flag from the sandbox api ready for the next test to run

```
after(() => {
	cy.resetUser()
})
```

The reason we only see this sometimes, is because we are running our functional tests with the Cypress `--parallel` flag which splits the tests over multiple CI machines. If a test that sets a feature flag is missing the `after()` call to remove that feature flag, there is a chance of breaking tests that run after it if those tests are interacting with the same area of the website that a feature flag can modify.
The reason that same test can pass if you re-run the Circle Ci job, is the next time when Cypress splits the test files over multiple machines, the test that previously failed might not be running on the same machine as a test that sets a feature flag
