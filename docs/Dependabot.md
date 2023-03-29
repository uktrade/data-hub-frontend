# Managing Dependabot PRs

This is the process we have identified for dealing with Dependabot PRs that saves developer time and CircleCI resource.

1. Create a new branch called `chore/dependencies-[yyyy-mm-dd]`, inserting today’s date.
2. Open each Dependabot PR and check that the tests have passed. Re-run any failing tests as the majority of failures are caused by timeouts or flakiness. Codecov failures can be ignored.
3. Once all tests have passed, edit the PR so that the base branch is the `chore/dependencies` one. You should now be able to merge the PR without needing to request reviews.
4. Repeat steps 2 and 3 until all PRs are either merged or identified as needing further work. Any PRs with consistently failing tests can be passed to the Technical Excellence team if required.
5. Checkout the `chore` branch to your local machine. If required, carry out the appropriate tasks listed in the 'Additional actions' section below.
6. After all the PRs have been merged and any additional changes have been made, run `npm install`. Ensure that any changes to `package-lock.json` are included in your branch.
7. Build and run Storybook (`npm run storybook`) to ensure it works correctly (sometimes it breaks silently due to Dependabot changes).
8. Bring up your local frontend and carry out some basic smoke tests to ensure that nothing unexpected has happened.
9. Rebase the dependency branch against `main` to remove all the merge commits, then push the changes and open a PR.
10. Deploy your branch to the UAT environment to ensure that there are no issues with Jenkins/Cloudfoundry. If the deployment fails, don't proceed any further with the PR and notify the TechEx team.
11. If you are satisfied that everything is in order and all the tests have passed, request reviews as normal.
12. After merging the PR, ensure that the `release-storybook` job has passed and that Storybook is running as expected.
13. Ensure that the dev/staging deployments have succeeded. If they haven't, notify the TechEx team.
14. Removed orphan closed PR dependencies every first working day in quarter of the year for those older than 90 days.

## Additional actions

For some dependencies, additional changes are required. These should be done as part of the main Dependabot PR.

### Babel

The `@babel/core` and `@babel/preset-env` packages should, where possible, be kept at the same version number.

### Cypress

When Cypress is updated, the version used in [`Dockerfile.dependencies`](https://github.com/uktrade/data-hub-frontend/blob/main/Dockerfile.dependencies#L69) needs to be updated as well.

### Opensearch

If the Opensearch version has been updated in the API, the version used in [`docker-compose.e2e.backend`](https://github.com/uktrade/data-hub-frontend/blob/main/docker-compose.e2e.backend.yml#L48) needs to be updated to match.

### React

The `react-dom` and `react` packages should, where possible, be kept at the same version number.

### Bulk updgrade of dependency groups (Sentry and Storybook)

Some of the packages we use have several companion packages that should be kept at the same version in order for them to work correctly. In order to optimise the number of upgrades we perform and to prevent wastage of CircleCI resource on redundant PRs, Dependabot has been configured to only upgrade one dependency in the group with the expectation being that the others should be updated using a script.

We currently have two groups of dependencies that need to be updated in this manner:
- Sentry (`dependabot:update-sentry`)
- Storybook (`dependabot:update-storybook`)
