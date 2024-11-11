#!/usr/bin/env bash

set -eo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
BASE_DIR="$(
  cd $SCRIPT_DIR && cd ../.. &
  pwd
)"
SHELL_DIR=$BASE_DIR/shell
CREATORS_DIR=$BASE_DIR/creators/extension

function generate_tag_export() {
  NAME=$1

  case $NAME in
    "shell")
      SHELL_V=$(jq -r .version ${SHELL_DIR}/package.json)
      echo "SHELL_VERSION_TAG=shell-pkg-v$SHELL_V" >> $GITHUB_OUTPUT
      echo "Shell version retrieved ::: ${SHELL_V}"
      ;;
    "creators")
      CREATORS_V=$(jq -r .version ${CREATORS_DIR}/package.json)
      echo "CREATORS_VERSION_TAG=creators-pkg-v$CREATORS_V" >> $GITHUB_OUTPUT
      echo "Creators version retrieved ::: ${CREATORS_V}"
      ;;
  esac
}

generate_tag_export "shell"
generate_tag_export "creators"