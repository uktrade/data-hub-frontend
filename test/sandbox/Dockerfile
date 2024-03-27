FROM node:20.11.0-buster

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

CMD npx nodemon .
