# Upgrading Node Version

When NodeJs is updated it is worth noting it needs to be updated in a few places.

## Cloud Foundry build pack

Please update the build pack in `manifest.yml` to use the required [cloud foundry build pack release](https://github.com/cloudfoundry/nodejs-buildpack/releases).
Once this is done you can then chose the Node version for the next steps.

## Engines in package.json

Engines in `package.json` needs updating:

```
  "engines": {
    "node": "<node_version>"
  },
```

## Data Hub Docker images

- [Image for local development](../Dockerfile)
- [Image for tests (used by CircleCI)](../test/Dockerfile)
- [Image for visual tests](../test/visual/Dockerfile)

Once the "Image for tests" has been updated, you will need to [follow the instructions to build and push](Running tests.md) a new version of the image.

# Steps to follow for an upgrade

1. Update the `manifest.yml` to match the latest release number (See above)
2. Update Node on your local env to match the versions in the buildpack
3. Update all files below with the correct versions identified above:
   - `package.json`
   - `Dockerfile`
   - `test/Dockerfile`
   - `test/visual/Dockerfile`
   - `test/sandbox/Dockerfile`
4. Delete the `node_modules` directory and do an npm install `npm ci`
5. Run the unit tests to check the app `npm run test:unit` and then start the app `npm run develop` and do some quick smoke tests to ensure the app works
6. Update the image used by CircleCI as found here: `./Running tests.md` (I hold off publising the `:latest` tag until I am sure it has worked, so stop before this `docker push ukti/data-hub-frontend-test:latest`)
7. Update the `&docker_data_hub_base` alias in the CircleCI config file (`.circleci/config.yml`) to match the version created in the previos step.
8. Commit your changes, push the branch and then create a Draft PR - to get the tests running which will confirm the image above works correctly
9. Create a build in Jenkins to deploy to an environment (UAT is probably best here) so we can test the buildpack
10. Once the tests pass and the deployment works, mark the PR as ready for review (if you haven't already, publish the `:latest` tag from step 6)
11. Switch back the Node version so you can carry on with other tickets whilst waiting for the PR to be approved and merged ;-)
12. Once the PR has been merged, do a release to production to finish the process.
