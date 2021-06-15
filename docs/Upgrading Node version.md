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

# Steps to follow for an upgrade

1. Update the `manifest.yml` to match the latest release number (See above)
2. Update Node on your local env to match the versions in the buildpack
3. Update all files below with the correct versions identified above:
   - `package.json`
   - `Dockerfile.dependencies`
   - `test/visual/Dockerfile`
   - `test/sandbox/Dockerfile`
   - Step two of the native readme
4. Install the dependencies with `npm ci`
5. Run the unit tests to check the app `npm run test:unit` and then start the app `npm run develop` and do some quick smoke tests to ensure the app works
6. Commit your changes, push the branch and then create a Draft PR to get the tests running
7. Create a build in Jenkins to deploy to an environment (UAT or Demo are probably best here) so we can test the buildpack.
8. Once the tests pass and the deployment works, mark the PR as ready for review
9. Switch back the Node version so you can carry on with other tickets whilst waiting for the PR to be approved and merged ;-)
10. Once the PR has been merged, do a release to production to finish the process.
