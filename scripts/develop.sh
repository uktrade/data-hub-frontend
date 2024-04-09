#!/bin/sh

# Create a temporary log file
LOG_FILE=$(mktemp)
# Delete the temporary file when the script is terminated
trap "rm -f ${LOG_FILE}" INT TERM HUP EXIT
# Duplicate output of the frontend command to the log file,
# so that we still can see it in the console.
npm run develop --  --color | tee "${LOG_FILE}" &
# Subscribe to changes of the log file and
# start the backend when "asset-manifest" is logged.
tail -f "${LOG_FILE}" | awk '/assets-manifest/ {system("npm start")}'
