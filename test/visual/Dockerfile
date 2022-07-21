# E2E docker image used to run tests locally
FROM node:16.15.1-buster

# Install visual test dependencies
RUN apt-get update
RUN apt-get install -y imagemagick

# Install dockerize https://github.com/jwilder/dockerize
ENV DOCKERIZE_VERSION v0.2.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

COPY package.json yarn.lock /project/
RUN yarn set version 3.2.2

RUN yarn install

COPY . /project
CMD yarn test:visual
