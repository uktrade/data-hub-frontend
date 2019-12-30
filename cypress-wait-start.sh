#!/bin/bash
TRIES=180
WAIT_URL=$1
shift
echo "Waiting for $WAIT_URL"
until $(curl --output /dev/null --silent --head --fail $WAIT_URL)
do
    TRIES=$(($TRIES-1))
    if [ $TRIES -eq 0 ] ; then
        echo "Timed out waiting for $WAIT_URL"
        exit 1
    fi
    sleep 1
done
cypress run $@
