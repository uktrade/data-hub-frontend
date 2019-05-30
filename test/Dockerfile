# This docker image is used ONLY with CircleCI to run tests.
# For local development image see Dockerfile in the root directory of this project.

FROM node:8.15.1

# Increment this version each time when you edit Dockerfile.
ENV VERSION                1.0.0

ENV DOCKERIZE_VERSION      v0.3.0
ENV YARN_VERSION           1.15.2
ENV NPM_CONFIG_LOGLEVEL    warn
ENV NPM_CONFIG_UNSAFE_PERM true
ENV TZ                     Europe/London
ENV TERM xterm

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
RUN npm install -g yarn@$YARN_VERSION

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

# Install Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
  && apt-get update \
  && apt-get install -y dbus-x11 google-chrome-stable

# Install dependencies for acceptance tests
RUN apt-get install -y openjdk-8-jre

# Versions of local tools
RUN node -v
RUN npm -v
RUN yarn -v
RUN google-chrome --version
RUN git --version
