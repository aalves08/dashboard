#!/usr/bin/env bash

set -eo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
BASE_DIR="$(
  cd $SCRIPT_DIR && cd ../.. &
  pwd
)"
SHELL_DIR=$BASE_DIR/shell
CREATORS_DIR=$BASE_DIR/creators/extension

function generate_version_export() {
  NAME=$1

  case $NAME in
    "shell")
      SHELL_V=$(jq -r .version ${SHELL_DIR}/package.json)
      echo "SHELL_VERSION=$SHELL_V" >> "$GITHUB_ENV"
      echo "Shell version retrieved ::: ${SHELL_V}"
      ;;
    "creators")
      CREATORS_V=$(jq -r .version ${CREATORS_DIR}/package.json)
      echo "CREATORS_VERSION=$CREATORS_V" >> "$GITHUB_ENV"
      echo "Creators version retrieved ::: ${CREATORS_V}"
      ;;
  esac
}

generate_version_export "shell"
generate_version_export "creators"