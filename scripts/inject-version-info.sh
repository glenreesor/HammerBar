#!/usr/bin/env bash

VERSION_STRING="$1"
VERSION_SRC=src/version.ts

RED="\033[31m"
NORMAL="\033[0m"

function replace() {
  local constantName="$1"
  local newValue="$2"

  sedIsModern=true
  if [[ "$(uname)" == "Darwin" ]]; then
    sed --version > /dev/null 2>&1
    if [[ "$?" == "1" ]]; then
      # Version check failed, thus we're most likely using the
      # sed that comes with MacOS (rather than a modern gnu variant)
      sedIsModern=false
    fi
  fi

  regex="^export const $constantName."'*$'
  newValue="export const $constantName = '$newValue';"

  original=$(grep "$regex" $VERSION_SRC)

  if $sedIsModern; then
    sed -i "s/$regex/$newValue/" $VERSION_SRC
  else
    sed -i '' "s/$regex/$newValue/" $VERSION_SRC
  fi



  new=$(grep "$regex" $VERSION_SRC)

  echo "OLD: $original"
  echo "NEW: $new"
}

if [[ "$VERSION_STRING" = "" ]]; then
  echo -e "${RED} $0: Missing version string${NORMAL}"
  exit 1
fi

currentCommitHash=$(git rev-parse HEAD)
localFileChanges=$(git diff --name-only "$currentCommitHash")

isoUtcTimestamp=$(date -u +"%Y-%m-%d %H:%M:%S (UTC)")

replace VERSION "$VERSION_STRING"
echo

replace BUILD_DATE "$isoUtcTimestamp"
echo

hashSuffix=""
if [[ "$localFileChanges" != "" ]]; then
  hashSuffix=" (with local changes)"
fi

replace GIT_HASH "$currentCommitHash $hashSuffix"
