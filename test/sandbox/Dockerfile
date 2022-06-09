FROM node:16.15.1-buster

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

CMD npx nodemon .
