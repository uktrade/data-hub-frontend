FROM node:16.15.1-buster

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
RUN npm install - g yarn
RUN yarn set version berry

COPY . .
RUN yarn install
CMD yarn run nodemon
