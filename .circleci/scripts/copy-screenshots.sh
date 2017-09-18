#!/usr/bin/env bash
SCREENSHOT_DIRECTORY="test/acceptance/screenshots"

if [ -d "${SCREENSHOT_DIRECTORY}" ]; then
  cp -R ${SCREENSHOT_DIRECTORY}/ cucumber/screenshots
  printf "Cucumber screenshots copied"
fi
