FROM node:16.15.1-buster

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
RUN yarn set version 1.22.19

COPY . .
RUN yarn install
CMD yarn nodemon
