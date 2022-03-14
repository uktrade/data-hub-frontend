FROM gcr.io/sre-docker-registry/data-hub-frontend-dependencies:2.0.0

WORKDIR /usr/src/app

# Install dev packages
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

CMD npm run develop
