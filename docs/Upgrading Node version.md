# Upgrading Node Version

When NodeJs is updated it is worth noting it needs to be updated in a few places.

## Selecting the new version

There are a couple of considerations to consider when selecting a Node version to upgrade to:
- The version must be supported by the latest release of the [CloudFoundry Node buildpack](https://github.com/cloudfoundry/nodejs-buildpack/releases).
- The version must have a Cypress docker image associated with it, and appear in the [list of Cypress image tags](https://hub.docker.com/r/cypress/base/tags).

If both of these criteria are not met, it will not be possible to build the new dependency image locally and it will not be possible to proceed with the upgrade.

# Steps to follow for an upgrade

1. Update the `data-hub-frontend/.circleci/config.yml` file to the latest [paketo builder-jammy-full buildpack](https://github.com/paketo-buildpacks/builder-jammy-full).
2. Check its releases and see what version of [paketo-buildpacks/node-engine](https://github.com/paketo-buildpacks/node-engine) is installed. This is the package which installs node.
2. You can see what node versions are available in the [paketo-buildpacks/node-engine](https://github.com/paketo-buildpacks/node-engine) by checking the releases.
3. Install and set your local `nvm` to use the chosen Node version
```bash
nvm install VERSION
nvm use VERSION
```
4. Update the engines in `package.json` and install the dependencies with `npm ci`.
5. Update the version used in `Dockerfile.dependencies`, then create/upload a new version of the dependency image (use the instructions from the [Docker readme](./Docker.md)). Ensure that the `Dockerfile` is using the image you created or CircleCI will not be able to run most of the tests.
6. Update the engines in `test/sandbox/package.json` and install the dependencies with `npm ci`.
7. Update the node versions used in the below files:
   - `test/sandbox/Dockerfile`
   - Step two of the native readme
8. Run the unit tests to check the app `npm run test:unit`, and then start the app `npm run develop` and do some quick smoke tests to ensure the app works
9. Commit your changes, push the branch and then create a Draft PR to get the tests running
10. Deploy the branch to the UAT environment so we can test the buildpack.
11. Once the tests pass and the deployment works, mark the PR as ready for review
12. Switch back the Node version so you can carry on with other tickets whilst waiting for the PR to be approved and merged ;-)
13. Once the PR has been merged, do a release to production to finish the process.
