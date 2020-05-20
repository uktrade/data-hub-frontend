FROM openjdk:8u171-jre-slim

ENV LANG C.UTF-8

RUN apt-get update

RUN apt-get install -y wget

RUN wget https://github.com/getsandbox/sandbox/releases/download/1.1.0/sandbox-runtime.tar \
  && tar -C /usr/local/bin -xvf sandbox-runtime.tar \
  && mv /usr/local/bin/sandbox-runtime /usr/local/bin/sandbox \
  && rm sandbox-runtime.tar

WORKDIR /usr/src/app
COPY . .

EXPOSE 8001

CMD sandbox --port=${PORT:-8001} --watch=true run
