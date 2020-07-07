# E2E docker image used to run tests locally
FROM node:12.18.0

# Install visual test dependencies
RUN apt-get update
RUN apt-get install -y imagemagick

# Install dockerize https://github.com/jwilder/dockerize
ENV DOCKERIZE_VERSION v0.2.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /project
COPY package.json package-lock.json /project/
RUN npm install

COPY . /project
CMD npm run test:visual
