#!/usr/bin/env bash

GIT_HOOKS=".git/hooks"
PROJECT_HOOKS="git-hooks"

if [ -d ${GIT_HOOKS} ]; then
echo "---- Installing project git hooks ----"

chmod -R +x ${PROJECT_HOOKS} && \
cp -aR ${PROJECT_HOOKS}/* ${GIT_HOOKS}
fi
