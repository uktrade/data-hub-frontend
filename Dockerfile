FROM gcr.io/sre-docker-registry/data-hub-frontend-dependencies:2.0.0

ARG CURRENT_UID
ARG CURRENT_GID

USER root
RUN chown -R $CURRENT_UID:$CURRENT_GID /home/node

WORKDIR /usr/src/app

# Install dev packages
COPY --chown=$CURRENT_UID:$CURRENT_GID package.json .
COPY --chown=$CURRENT_UID:$CURRENT_GID package-lock.json .

USER "$CURRENT_UID:$CURRENT_GID"
CMD npm config set loglevel info
RUN npm install

COPY --chown=$CURRENT_UID:$CURRENT_GID . .

CMD npm run develop
