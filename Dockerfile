FROM gcr.io/sre-docker-registry/data-hub-frontend-dependencies:1.0.6

ENV NPM_CONFIG_LOGLEVEL    warn
ENV NPM_CONFIG_UNSAFE_PERM true
ENV TZ                     Europe/London
ENV NODE_ENV               development

# Set timezone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
  && echo "Timezone: $(date +%z)"

RUN mkdir -p /usr/src/app
RUN chown -R node: /usr/src/app
RUN npm install -g npm@8.1.2
USER node

WORKDIR /usr/src/app
RUN npm -v

# Install dev packages
COPY --chown=node:node package.json .
COPY --chown=node:node package-lock.json .

RUN npm install

COPY --chown=node:node . .

CMD npm run develop
