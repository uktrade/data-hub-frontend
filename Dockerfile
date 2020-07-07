FROM node:12.18.0

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

# TODO: Fix `develop` command so it won't start the node server until the manifesty file is there, for now we need to build it twice
RUN npm run build

CMD npm run develop
