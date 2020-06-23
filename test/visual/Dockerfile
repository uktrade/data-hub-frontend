# E2E docker image used to run tests locally
FROM node:12.18.0

ENV YARN_VERSION 1.22.4

# Install visual test dependencies
RUN apt-get update
RUN apt-get install -y imagemagick

# Use specific yarn version
RUN npm install -g --force yarn@$YARN_VERSION

# Install dockerize https://github.com/jwilder/dockerize
ENV DOCKERIZE_VERSION v0.2.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /project
COPY package.json yarn.lock /project/
RUN yarn install

COPY . /project
CMD yarn test:visual
