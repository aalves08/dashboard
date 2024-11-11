#!/usr/bin/env bash

set -eo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
BASE_DIR="$(
  cd $SCRIPT_DIR && cd ../.. &
  pwd
)"
SHELL_DIR=$BASE_DIR/shell
CREATORS_DIR=$BASE_DIR/creators/extension

if [ -z "$BRANCH" ]; then
  echo "You need to specify a BRANCH variable first!"
  exit 1
fi

function generate_version_export() {
  NAME=$1

  case $NAME in
    "shell")
      SHELL_VERSION=$(jq -r .version ${SHELL_DIR}/package.json)
      declare SHELL_VERSION_$BRANCH=${SHELL_VERSION}
      varname=SHELL_VERSION_$BRANCH
      echo shell version ::: ${!varname}
      ;;
    "creators")
      CREATORS_VERSION=$(jq -r .version ${CREATORS_DIR}/package.json)
      declare CREATORS_VERSION_$BRANCH=${CREATORS_VERSION}
      varname=CREATORS_VERSION_$BRANCH
      echo ${!varname}
      echo rancher version ::: ${!varname}
      ;;
  esac
}

echo "Retrieve current Shell version"

generate_version_export "shell"
generate_version_export "creators"

# export RANCHER_VERSION_E2E=${{ matrix.rancherEnv[1] }}