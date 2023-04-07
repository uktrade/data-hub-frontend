ARG CHROME_VERSION='107.0.5304.121-1'
ARG NODE_VERSION='18.7.0'
ARG CYPRESS_VERSION='12.10.0'

FROM cypress/factory

ENV DOCKERIZE_VERSION      v0.6.1
ENV NPM_CONFIG_LOGLEVEL    warn
ENV NPM_CONFIG_UNSAFE_PERM true
ENV TZ                     Europe/London
ENV TERM                   xterm
ENV LANG                   C.UTF-8
ENV NODE_ENV               development

WORKDIR /usr/src/app

# Install common dependencies
RUN apt-get update && apt-get install -y \
  tzdata \
  wget \
  curl \
  make \
  git

# Install dockerize
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Install visual test dependencies
RUN apt-get install -y imagemagick libgbm1

# Set timezone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
  && echo "Timezone: $(date +%z)"

# Set the ownership and permission for directories
RUN mkdir -p /home/node
RUN chown -R node:node /home/node
RUN chmod -R 777 /home/node
RUN mkdir -p /home/node/.local && chown -R node:node /home/node/.local
RUN chmod -R 777 /home/node/.local
RUN mkdir -p /home/node/.cache && chown -R node:node /home/node/.cache
RUN chmod -R 777 /home/node/.cache
RUN mkdir -p /home/node/.npm && chown -R node:node /home/node/.npm
RUN chmod -R 777 /home/node/.npm
RUN chown -R node:node /usr/src/app
RUN chmod -R 777 /usr/src/app/

USER node

ENV HOME=/home/node

ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV NODE_PATH="/usr/local/lib/node_modules"

COPY --chown=node:node package.json .
COPY --chown=node:node package-lock.json .
COPY --chown=node:node .npmrc .

# Install dev packages
RUN npm install

COPY --chown=node:node . .

CMD npm run develop