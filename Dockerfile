FROM node:12.17.0

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
RUN yarn

COPY . .

# TODO: Fix `develop` command so it won't start the node server until the manifesty file is there, for now we need to build it twice
RUN yarn build

CMD yarn develop
