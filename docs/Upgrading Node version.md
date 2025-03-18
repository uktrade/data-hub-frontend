# Upgrading Node Version

When NodeJs is updated it is worth noting it needs to be updated in a few places.

## Selecting the new version

There are a couple of considerations to consider when selecting a Node version to upgrade to:
- The version must be supported by the latest release of the [ci-image-builder](https://github.com/uktrade/ci-image-builder/blob/main/image_builder/configuration/builder_configuration.yml) [paketo-buildpacks/builder-jammy-full](https://github.com/paketo-buildpacks/builder-jammy-full/releases) buildpack.
- The version must have a Cypress docker image associated with it, and appear in the [list of Cypress image tags](https://hub.docker.com/r/cypress/base/tags).

If both of these criteria are not met, it will not be possible to build the new dependency image locally and it will not be possible to proceed with the upgrade.

# Steps to follow for an upgrade

1. Check the node version is supported by the platform team [ci-image-builder](https://github.com/uktrade/ci-image-builder) package.
   1. Check the builder configuration for the latest version supported by the platform team: [ci-image-builder](https://github.com/uktrade/ci-image-builder/blob/main/image_builder/configuration/builder_configuration.yml)
   1. Find that release in the [paketo-buildpacks/builder-jammy-full](https://github.com/paketo-buildpacks/builder-jammy-full/releases) repo.
   1. Expand the release to see all of the "Buildpacks".
   1. Find the paketo-buildpacks/node-engine buildpack, there may be more than one, pick the latest version. This is the package which installs Node.js
   1. Go the the [paketo-buildpacks/node-engine](https://github.com/paketo-buildpacks/node-engine/releases) releases page and find that release.
   1. Look at the dependencies for the supported node version and see if it matches the version you want.
   1. If it doesn't wait or investigate if we require using these buildpacks.
1. Install and set your local `nvm` to use the chosen Node version
```bash
nvm install VERSION
nvm use VERSION
```
1. Update the engines in `package.json` and install the dependencies with `npm ci`.
1. Update the version used in `Dockerfile.dependencies`, then create/upload a new version of the dependency image (use the instructions from the [Docker readme](./Docker.md)). Ensure that the `Dockerfile` is using the image you created or CircleCI will not be able to run most of the tests.
1. Update the engines in `test/sandbox/package.json` and install the dependencies with `npm ci`.
1. Update the node versions used in the below files:
   - `test/sandbox/Dockerfile`
   - Step two of the native readme
1. Run the unit tests to check the app `npm run test:unit`, and then start the app `npm run develop` and do some quick smoke tests to ensure the app works
1. Commit your changes, push the branch and then create a Draft PR to get the tests running
1. Deploy the branch to the UAT environment so we can test the buildpack.
1. Once the tests pass and the deployment works, mark the PR as ready for review
1. Switch back the Node version so you can carry on with other tickets whilst waiting for the PR to be approved and merged ;-)
1. Once the PR has been merged, do a release to production to finish the process.
