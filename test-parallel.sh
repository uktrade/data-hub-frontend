#!/bin/bash

# List all spec files
SPEC_FILES=$(find test/functional/cypress/specs -name '*.js')
TOTAL_SPECS=$(echo "$SPEC_FILES" | wc -l)

echo Total number of specs $TOTAL_SPECS

# Determine the number of files to run on this container
FILES_PER_CONTAINER=$(( TOTAL_SPECS / CIRCLE_NODE_TOTAL ))

echo Files per container $FILES_PER_CONTAINER

REMAINDER=$(( TOTAL_SPECS % CIRCLE_NODE_TOTAL ))

echo Remainder specs $REMAINDER

# Adjust the number of files for this container if necessary
if (( CIRCLE_NODE_INDEX < REMAINDER )); then
  (( FILES_PER_CONTAINER++ ))
fi

# Determine the range of files to run on this container
START_INDEX=$(( CIRCLE_NODE_INDEX * FILES_PER_CONTAINER + 1 ))
if (( CIRCLE_NODE_INDEX < REMAINDER )); then
  START_INDEX=$(( START_INDEX + CIRCLE_NODE_INDEX ))
else
  START_INDEX=$(( START_INDEX + REMAINDER ))
fi
END_INDEX=$(( START_INDEX + FILES_PER_CONTAINER - 1 ))

# Get the list of files to run on this container
SPECS_TO_RUN=$(echo "$SPEC_FILES" | sed -n "$START_INDEX,$END_INDEX p" | tr '\n' ',')
SPECS_TO_RUN=$(echo "$SPECS_TO_RUN" | sed 's/,$//')
echo "export SPECS_TO_RUN=\"$SPECS_TO_RUN\"" >> $BASH_ENV
echo $SPECS_TO_RUN
