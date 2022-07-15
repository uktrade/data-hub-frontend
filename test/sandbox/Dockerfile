FROM node:16.16.0-buster

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
RUN yarn policies set-version 3.2.1
RUN yarn install

COPY . .

CMD yarn run nodemon
