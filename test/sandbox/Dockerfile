FROM openjdk:8u171-jre-slim

ADD https://dl.bintray.com/getsandbox/public/com/sandbox/sandbox/1.0.235/sandbox-1.0.235-all.jar /sandbox.jar
ENV LANG C.UTF-8

WORKDIR /usr/src/app
COPY . .

EXPOSE 8001

CMD java -XX:+UseG1GC -XX:+UseStringDeduplication ${JAVA_OPTS:--Xmx128m -Xmx128m} -jar /sandbox.jar --port=${PORT:-8001} --watch=false $JAVA_PARAMS run
