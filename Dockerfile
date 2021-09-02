FROM gcr.io/sre-docker-registry/data-hub-frontend-dependencies:1.0.6

ENV NPM_CONFIG_LOGLEVEL    warn
ENV NPM_CONFIG_UNSAFE_PERM true
ENV TZ                     Europe/London
ENV NODE_ENV               development

# Set timezone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
  && echo "Timezone: $(date +%z)"

WORKDIR /usr/src/app

# Install dev packages
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

CMD npm run develop
