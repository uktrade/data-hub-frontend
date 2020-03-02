# This docker image is used ONLY with CircleCI to run tests.
# For local development image see Dockerfile in the root directory of this project.

FROM node:12.16.1

ENV DOCKERIZE_VERSION      v0.3.0
ENV YARN_VERSION           1.22.0
ENV NPM_CONFIG_LOGLEVEL    warn
ENV NPM_CONFIG_UNSAFE_PERM true
ENV TZ                     Europe/London
ENV TERM                   xterm
ENV LANG                   C.UTF-8

RUN apt-get update

# Install common dependencies
RUN apt-get install -y \
  tzdata \
  wget \
  curl \
  make \
  git

# Fix error when libpng cannot be found after CircleCI restores cache for pngquant-bin.
# See https://github.com/tcoopman/image-webpack-loader/issues/95
RUN wget -q -O /tmp/libpng12.deb http://mirrors.kernel.org/ubuntu/pool/main/libp/libpng/libpng12-0_1.2.54-1ubuntu1_amd64.deb \
  && dpkg -i /tmp/libpng12.deb \
  && rm /tmp/libpng12.deb

# Use specific yarn version
RUN npm install -g --force yarn@$YARN_VERSION

# Set timezone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
  && echo "Timezone: $(date +%z)"

# Install dockerize
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Install Cypress dependencies
RUN apt-get install -y \
  libgtk2.0-0 \
  libnotify-dev \
  libgconf-2-4 \
  libnss3 \
  libxss1 \
  libasound2 \
  xvfb

# Install visual test dependencies
RUN apt-get install -y imagemagick

# Install Chrome (74)
# We decided to lock on Chrome 74 for now until we solve random error when running functional tests: "Error: There has been an OAuth stateId mismatch"
# See related CircleCI build: https://circleci.com/gh/uktrade/data-hub-frontend/48022#tests/containers/3
RUN apt-get install -y xdg-utils libgtk-3-0 lsb-release libappindicator3-1 fonts-liberation \
  && curl https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_74.0.3729.169-1_amd64.deb -O \
  && dpkg -i google-chrome-stable_74.0.3729.169-1_amd64.deb \
  && rm google-chrome-stable_74.0.3729.169-1_amd64.deb

# Install dependencies for acceptance tests
RUN apt-get install -y openjdk-8-jre

# Install sandbox
RUN wget -O /usr/local/sandbox.jar https://dl.bintray.com/getsandbox/public/com/sandbox/sandbox/1.0.235/sandbox-1.0.235-all.jar

# Versions of local tools
RUN node -v
RUN npm -v
RUN yarn -v
RUN google-chrome --version
RUN git --version
RUN java -version
