FROM node:16.15.1-buster

WORKDIR /usr/src/app/test/sandbox

COPY package.json .
COPY yarn.lock .
RUN yarn policies set-version 3.2.1

COPY . .
RUN touch yarn.lock
RUN yarn install
CMD yarn run nodemon
