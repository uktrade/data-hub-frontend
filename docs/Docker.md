# Docker

_Helpful Docker commands that allow you to bring up containers, run a bunch of tests_ and then stop the containers.

**Note for Mac Users:** By default, docker on Mac will restrict itself to using just 2GB of memory. This [should be increased](https://docs.docker.com/docker-for-mac/#resources) to at least 6GB to avoid running in to unexpected problems.

**Note for all users:** The docker volumes for the frontend, api and sandbox api are all mounted. This means that you should not need to rebuild the containers when you make changes and you should see your changes reflected immediately. However, there are certain changes that will require you to rebuild. In that case, bring down the containers and run the script again. The scripts will always rebuild you containers if it detects code changes, otherwise they will be quick to come up and will just use the images it has in the docker cache.

Prerequisite:
    
    cp sample.env .env

# Table of Contents

- [Creating Docker container for CircleCI](#creating-docker-container-for-circleci)
- [Start Dev](#start-dev)
- [Start the Functional tests](#start-the-functional-tests)
- [Start the E2E tests (DIT/LEP/DA)](#start-the-e2e-tests-ditlepda)
- [Start the Visual tests](#start-the-visual-tests)
- [Start the Unit tests](#start-the-unit-tests)

## Creating Docker container for CircleCI

```bash
export VERSION=1.0.4 # Increment this version each time when you edit Dockerfile.

Ensure you have gcloud sdk and you are logged in following their instructions:

https://cloud.google.com/sdk/docs

docker build -f Dockerfile.dependencies -t data-hub-frontend-dependencies .

docker tag data-hub-frontend-dependencies:latest gcr.io/sre-docker-registry/data-hub-frontend-dependencies:${VERSION}

docker tag data-hub-frontend-dependencies:latest gcr.io/sre-docker-registry/data-hub-frontend-dependencies:latest

docker push gcr.io/sre-docker-registry/data-hub-frontend-dependencies:${VERSION}

docker push gcr.io/sre-docker-registry/data-hub-frontend-dependencies:latest
```

Your image should be now listed at [Google Container Registry](http://gcr.io/sre-docker-registry/github.com/uktrade).

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

## Start the Visual tests
Ensure both env vars have been set:
    `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY`

### Bring up both the Frontend and the Mock API
    make start-mock         // bring up the containers
    make visual-tests       // runs the tests inside the container
    make stop-mock          // stop and remove the containers

## Start the Unit tests

### Build the Frontend and run the Unit tests
     make unit-client-tests
