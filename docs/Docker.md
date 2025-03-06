# Docker

_Helpful Docker commands that allow you to bring up containers, run a bunch of tests_ and then stop the containers.

**Note for Mac Users:** By default, docker on Mac will restrict itself to using just 2GB of memory. This [should be increased](https://docs.docker.com/docker-for-mac/#resources) to at least 6GB to avoid running in to unexpected problems.

**Note for Mac Users 2:** Should you ever come across this error:

```
qemu: uncaught target signal 11 (Segmentation fault) - core dumped
```

Go to _Docker Desktop -> Settings -> General_ and check the
_Use Rosetta for x86/amd64 emulation on Apple Silicon_ checkbox.
That should fix the issue.

**Note for all users:** The docker volumes for the frontend, api and sandbox api are all mounted. This means that you should not need to rebuild the containers when you make changes and you should see your changes reflected immediately. However, there are certain changes that will require you to rebuild. In that case, bring down the containers and run the script again. The scripts will always rebuild you containers if it detects code changes, otherwise they will be quick to come up and will just use the images it has in the docker cache.

Prerequisite:

    cp sample.env .env

# Table of Contents

- [Docker](#docker)
- [Table of Contents](#table-of-contents)
  - [Creating Docker container for CircleCI](#creating-docker-container-for-circleci)
  - [Start Dev](#start-dev)
    - [Bring up the Dev environment](#bring-up-the-dev-environment)
  - [Start the Functional tests](#start-the-functional-tests)
    - [Bring up both the Frontend and the Mock API](#bring-up-both-the-frontend-and-the-mock-api)
  - [Start the E2E tests (DIT/LEP/DA)](#start-the-e2e-tests-ditlepda)
    - [Bring up both the Frontend and the API for a particular user](#bring-up-both-the-frontend-and-the-api-for-a-particular-user)
      - [DIT user](#dit-user)
      - [LEP user](#lep-user)
      - [DA user](#da-user)
  - [Start the Accessibility tests](#start-the-accessibility-tests)
  - [Start the Unit tests](#start-the-unit-tests)
    - [Build the Frontend and run the Unit tests](#build-the-frontend-and-run-the-unit-tests)

## Creating Docker container for CircleCI

Ensure you have [gcloud CLI installed](https://cloud.google.com/sdk/docs/install-sdk) and you are logged in following their instructions (you will need to ask SRE for access). You will need to setup authentication using the [gcloud credential helper](https://cloud.google.com/container-registry/docs/advanced-authentication#gcloud-helper) before you can push the new container. The project to select is `sre-docker-registry`

> If you have issues when building the dependencies image, especially if you are using a Mac with an Apple chip, this is most likely due to incompatibility with the `arm` architecture; instead you need to build on `amd` architecture. Please refer to [troubleshooting guide](./Troubleshooting.md) and follow the steps under the Building dependency images section, before retrying the build command below.

```bash
export VERSION=5.0.0 # Increment this version each time when you edit Dockerfile.

docker build -f Dockerfile.dependencies -t data-hub-frontend-dependencies . --platform linux/amd64

docker tag data-hub-frontend-dependencies:latest gcr.io/sre-docker-registry/data-hub-frontend-dependencies:${VERSION}

docker tag data-hub-frontend-dependencies:latest gcr.io/sre-docker-registry/data-hub-frontend-dependencies:latest

docker push gcr.io/sre-docker-registry/data-hub-frontend-dependencies:${VERSION}

docker push gcr.io/sre-docker-registry/data-hub-frontend-dependencies:latest
```

Your image should be now listed at [Google Container Registry](https://console.cloud.google.com/gcr/images/sre-docker-registry/global/data-hub-frontend-dependencies).

## Start Dev

Prerequisite: Ensure `data-hub-api` is sitting in the same directory as `data-hub-frontend`

### Bring up the Dev environment

    make start-dev          // bring up the containers
    make stop-dev           // stop and remove the containers

Once the containers are up, in a browser go to: `http://localhost:3000` and you'll be redirected to mock-sso. For now (we're working on it) change the domain from `mock-sso` to `localhost` to view the application.

## Start the Functional tests

### Bring up both the Frontend and the Mock API

    make start-mock         // bring up the containers
    make functional-tests   // runs the tests inside the container
    make stop-mock          // stop and remove the containers

Instead of running the tests inside the container you can also run them outside the container `npm run test:functional`.

## Start the E2E tests (DIT/LEP/DA)

### Bring up both the Frontend and the API for a particular user

#### DIT user

    make start-e2e-dit      // bring up the containers
    make e2e-tests-dit      // run the tests inside the container
    make stop-e2e           // stop and remove the containers

#### LEP user

    make start-e2e-lep      // bring up the containers
    make e2e-tests-lep      // run the tests inside the container
    make stop-e2e           // stop and remove the containers

#### DA user

    make start-e2e-da       // bring up the containers
    make e2e-tests-da       // run the tests inside the container
    make stop-e2e           // stop and remove the containers

Note: Before running the tests (and the containers are up) in a browser go to: `http://localhost:3000` and you'll be redirected to mock-sso. For now (we're working on it) change the domain from `mock-sso` to `localhost` to view the application.

## Start the Accessibility tests

    make start-mock          // bring up the containers
    make a11y-tests          // run the tests inside the container

## Start the Unit tests

### Build the Frontend and run the Unit tests

     make unit-client-tests
