#!/usr/bin/env bash

cd cucumber/reports
for file in *.json; do
  [ -f "$file" ] || break
  cp "$file" "../$(basename "$file" .json).cucumber"
done
