# Upgrading Node Version

When NodeJs is updated it is worth noting it needs to be updated in a few places.

## Cloud Foundry build pack

Please update the build pack in `manifest.yml` to use the required [cloud foundry build pack release](https://github.com/cloudfoundry/nodejs-buildpack/releases).
Once this is done you can then chose the node version for the next steps.

## Engines in package.json

Engines in `package.json` needs updating:

```
  "engines": {
    "node": "<node_version>"
  },
```

## Data Hub Docker images

* [Image for local development](../Dockerfile)
* [Image for tests (used by CircleCI)](../test/Dockerfile)
* [Image for visual tests](../test/visual/Dockerfile)

Once the "Image for tests" has been updated, you will need to [follow the instructions to build and push](Running tests.md) a new version of the image.
