Documentation
====================

## Installation instructions

Please follow the documentation below to install sandbox.

### Using sandbox within docker (preferred method)

1. Clone this repo

2. `cd` into the folder you just cloned

3. Build the image:
	```bash
	docker build -t data-hub-sandbox .
	```

4. Start sandbox server on port `8001`:
	```bash
	docker run -it -p 8001:8001 data-hub-sandbox
	```
	
	Stop the server by pressing `CTRL`+`C`
	
### Additional steps if you're running sandbox with Data Hub Frontend for functional testing

1. You'll also have to run redis as the sandbox does not come with this and will throw an error on the frontend without it. So open a new terminal window and run `docker run -it -p 6379:6379 redis:3.2`

2. `cd` into your datahub-front-end folder

3. Run `yarn run develop` and you should now be all set up

4. When you make changes to the fixtures, you'll need to rebuild the docker image and then run the server again.

### Using sandbox on host machine

1. Install sandbox, for more info see [instructions](https://github.com/getsandbox/sandbox)
  ```bash
  wget https://s3.amazonaws.com/sandbox-binaries/runtime-binary.tar \
    && tar -C /usr/local/bin -xzvf runtime-binary.tar \
    && rm runtime-binary.tar
  ```

2. Start sandbox on port `8001`:
	```bash
	sandbox run --port="8001" --watch=true
	```
	
### Creating Docker container for CircleCI

Docker image will be automatically rebuilt on each push.

However, you can still do this manually.
 
```bash
docker login # Ask webops for Docker Hub access to the ukti group.
docker build -f Dockerfile -t data-hub-sandbox .

docker tag data-hub-sandbox:latest ukti/data-hub-sandbox:latest

docker push ukti/data-hub-sandbox:latest
```

You image should be now listed at [Docker Hub](https://cloud.docker.com/u/ukti/repository/docker/ukti/data-hub-sandbox/tags).
