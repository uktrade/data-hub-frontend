FROM node:16.15.1-buster

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
RUN yarn set version 3.2.1

COPY . .
RUN yarn install
CMD yarn run nodemon
