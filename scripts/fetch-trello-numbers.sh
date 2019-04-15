#!/bin/bash

target_hash="origin/master"
latest_hash="origin/develop"
output_file="scripts/trello-numbers.txt"

while getopts l:t:o: option; do
    case "${option}" in
    l) latest_hash=${OPTARG};;
    t) target_hash=${OPTARG};;
    o) output_file=${OPTARG};;
    esac
done

git log $target_hash..$latest_hash --merges --pretty=oneline --pretty=format:"%s" | awk -F "/" '{ print $3 }' | awk -F "-" '{ print $1 }' > $output_file
