FROM gcr.io/sre-docker-registry/data-hub-frontend-dependencies:2.0.2

ARG CURRENT_UID
ARG CURRENT_GID

USER root
RUN chown -R $CURRENT_UID:$CURRENT_GID /home/node
RUN chown -R $CURRENT_UID:$CURRENT_GID /usr/src/app

WORKDIR /usr/src/app

# Install dev packages
COPY --chown=$CURRENT_UID:$CURRENT_GID package.json .
COPY --chown=$CURRENT_UID:$CURRENT_GID yarn.lock .
COPY --chown=$CURRENT_UID:$CURRENT_GID .npmrc .

USER "$CURRENT_UID:$CURRENT_GID"
CMD yarn config set loglevel info

ENV NODE_OPTIONS="--max-old-space-size=8192"

COPY --chown=$CURRENT_UID:$CURRENT_GID . .

RUN yarn set version 3.2.1
RUN touch yarn.lock
RUN yarn install

CMD yarn develop
