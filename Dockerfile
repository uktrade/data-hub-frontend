FROM node:16.14.0-buster

ENV DOCKERIZE_VERSION      v0.6.1
ENV NPM_CONFIG_LOGLEVEL    warn
ENV NPM_CONFIG_UNSAFE_PERM true
ENV TZ                     Europe/London
ENV TERM                   xterm
ENV LANG                   C.UTF-8
ENV NODE_ENV               development
ENV CHROME_VERSION         93.0.4577.63-1

# Install common dependencies
RUN apt-get install -y \
  tzdata \
  wget \
  curl \
  make \
  git

# Install dockerize
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Install Cypress dependencies
RUN apt-get update
RUN apt-get install -y \
  libgtk2.0-0 \
  libnotify-dev \
  libgconf-2-4 \
  libnss3 \
  libxss1 \
  libasound2 \
  libpng-dev \
  zlib1g-dev  \
  xvfb

# Install visual test dependencies
RUN apt-get install -y imagemagick libgbm1

# Install Chrome (Version 85)
# See all available versions for download on: http://170.210.201.179/linux/chrome/deb/pool/main/g/google-chrome-stable/
RUN apt-get install -y xvfb xdg-utils libgtk-3-0 lsb-release libappindicator3-1 fonts-liberation libasound2 libnspr4 libnss3 \
  && curl http://170.210.201.179/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_${CHROME_VERSION}_amd64.deb -O \
  && dpkg -i google-chrome-stable_${CHROME_VERSION}_amd64.deb \
  && rm google-chrome-stable_${CHROME_VERSION}_amd64.deb \
  && google-chrome --version

# Install cypress
COPY package.json .
COPY package-lock.json .
RUN npm install -g cypress@9.5.1
RUN cypress verify

RUN cypress cache path
RUN cypress cache list
RUN cypress info
RUN cypress version

# Remove the above once Dockerfile.dependencies is released.

RUN npm install -g cypress@9.5.1

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
