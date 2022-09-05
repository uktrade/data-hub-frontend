# Upgrading Node Version

When NodeJs is updated it is worth noting it needs to be updated in a few places.

## Cloud Foundry build pack

Please update the build pack in `manifest.yml` to use the required [cloud foundry build pack release](https://github.com/cloudfoundry/nodejs-buildpack/releases).
Once this is done you can then chose the Node version for the next steps.

# Steps to follow for an upgrade

1. Update the `manifest.yml` to match the latest release number (See above)
2. Update Node on your local env to match the versions in the buildpack
3. Update the engines in `package.json` and install the dependencies with `npm ci`.
4. Update the version used in `Dockerfile.dependencies`, then create/upload a new version of the dependency image (use the instructions from the [Docker readme](./Docker.md)). Ensure that the `Dockerfile` is using the image you created or CircleCI will not be able to run most of the tests.
5. Update the engines in `test/sandbox/package.json` and install the dependencies with `npm ci`.
6. Update the node versions used in the below files:
   - `test/visual/Dockerfile`
   - `test/sandbox/Dockerfile`
   - Step two of the native readme
7. Run the unit tests to check the app `npm run test:unit`, and then start the app `npm run develop` and do some quick smoke tests to ensure the app works
8. Commit your changes, push the branch and then create a Draft PR to get the tests running
9. Deploy the branch to the UAT environment so we can test the buildpack.
10. Once the tests pass and the deployment works, mark the PR as ready for review
11. Switch back the Node version so you can carry on with other tickets whilst waiting for the PR to be approved and merged ;-)
12. Once the PR has been merged, do a release to production to finish the process.
