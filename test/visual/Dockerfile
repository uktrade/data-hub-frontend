# E2E docker image used to run tests locally
FROM node:10.16.0

ENV NPM_CONFIG_LOGLEVEL    warn
ENV NPM_CONFIG_UNSAFE_PERM true

RUN mkdir -p /project
WORKDIR /project

ADD . /project/

RUN apt-get update

# Install dockerize https://github.com/jwilder/dockerize
ENV DOCKERIZE_VERSION v0.2.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Install visual test dependencies
RUN apt-get install -y imagemagick
RUN yarn install

CMD yarn test:visual
