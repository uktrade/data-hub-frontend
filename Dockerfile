FROM gcr.io/sre-docker-registry/data-hub-frontend-dependencies:2.0.0

WORKDIR /usr/src/app

# Install dev packages
COPY --chown=1000:1000 package.json .
COPY --chown=1000:1000 package-lock.json .
RUN npm install

COPY --chown=1000:1000 . .

CMD npm run develop
