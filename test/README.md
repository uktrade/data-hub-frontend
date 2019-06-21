# Testing

## Creating Docker container for CircleCI

```bash
export VERSION=2.0.0 # Increment this version each time when you edit Dockerfile.

docker login # Ask webops for Docker Hub access to the ukti group.
docker build -f test/Dockerfile -t data-hub-frontend-test .

docker tag data-hub-frontend-test:latest ukti/data-hub-frontend-test:${VERSION}
docker tag data-hub-frontend-test:latest ukti/data-hub-frontend-test:latest

docker push ukti/data-hub-frontend-test:${VERSION}
docker push ukti/data-hub-frontend-test:latest
```

You image should be now listed at [Docker Hub](https://cloud.docker.com/u/ukti/repository/docker/ukti/data-hub-frontend-test/tags).

## Executing CircleCI jobs locally

Not all the jobs currently can be executed locally.

```bash
curl -fLSs https://circle.ci/cli | bash
circleci local execute --job unit_tests
circleci local execute --job unit_client_tests
```
