#!/usr/bin/env bash

GREEN="\033[32m"
NORMAL="\033[0m"

thisDir=$(dirname "$0")

version=""

while [[ $version = "" ]]; do
  echo -e "${GREEN}Enter new version string without v${NORMAL}"
  read input
  if [[ "$input" != "" ]]; then
    version="$input"
    break
  fi
done

"$thisDir"/inject-version-info.sh "$version"
