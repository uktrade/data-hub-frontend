FROM node:12.18.0

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .

CMD yarn exec nodemon .
