FROM node:12.16.1

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

CMD ["yarn", "develop"]
