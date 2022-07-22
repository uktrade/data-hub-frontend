FROM node:16.15.1-buster

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY . .
RUN npm uninstall yarn
RUN rm -rf "$HOME/.yarn"
RUN corepack prepare yarn@3.2.2 --activate
RUN yarn set version 3.2.2
RUN yarn install
CMD yarn start
