#!/usr/bin/env bash
START_TIME=$SECONDS

printf "Waiting for Datahub frontend to start\n"

until $(curl -s ${QA_HOST}/healthcheck > /dev/null); do
  printf '.'
  sleep 1

  if [ "$SECONDS" -gt 120 ]; then
    printf "\nCould not start Datahub frontend\n"
    exit 1
  fi
done

printf "\nDone in $((SECONDS-START_TIME)) seconds(s)\n"
