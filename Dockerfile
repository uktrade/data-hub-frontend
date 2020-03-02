# This docker image is used ONLY for local development.
# For CircleCI image which is used for tests see test/Dockerfile.
# Deployments are made using Jenkins and Cloud Foundry, see manifest.yml for the buildpack manifest file.

FROM ubuntu:16.04

ENV NODE_VERSION  12.16.1
ENV YARN_VERSION  1.22.0
ENV NVM_DIR       /usr/local/nvm
ENV NODE_PATH     $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH          $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Install packages needed by datahub frontend npm dependencies
RUN apt-get update && apt-get install -y wget build-essential libpq-dev curl libpng-dev

# Install dockerize https://github.com/jwilder/dockerize
ENV DOCKERIZE_VERSION v0.2.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Install nvm, node, npm and yarn
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.30.1/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default \
    && npm install -g yarn@$YARN_VERSION

# Confirm what has been installed
RUN . $NVM_DIR/nvm.sh \
  && echo "nodejs $(node -v)" \
  && echo "npm $(npm -v)" \
  && echo "yarn $(yarn -v)"

# Install package providing fuser command - necessary to run the app with code
# watching and debugging under nodemon
RUN apt-get install -y psmisc

# Setup app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .
RUN yarn build

EXPOSE 3000
EXPOSE 9229

CMD [ "yarn", "start" ]
