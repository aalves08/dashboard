#!/usr/bin/env bash

set -eo pipefail


validate_tagged_extension_creator() {
  TAG=$1
  NODE_VERSION=$2
  UPDATE=$3

  if [ -n "$UPDATE" ]; then
    echo "*** Will also cover the UPDATE path and MIGRATION on this run! ***"
    UPDATE="true"
  fi

  export NVM_DIR=~/.nvm
  source ~/.nvm/nvm.sh
  npm --help

  DIR=$(mktemp -d)
  pushd $DIR > /dev/null

  echo "*** Verifying extension creator for tag ::: ${TAG} ***"
  echo "Using temporary directory ${DIR}"

  echo "=> Setting up node version required for this env: ${NODE_VERSION}"

  

  nvm install ${NODE_VERSION}
  nvm use ${NODE_VERSION}

  # TODO: change yarn create to use the new tag approach (jordon to tweak code upstream)
  npm init @rancher/extension@${TAG} test-pkg --app-name test-app | cat

  pushd test-pkg > /dev/null

  yarn install

  yarn build-pkg test-pkg | cat


  if [ $UPDATE == "true" ]; then
    echo "*** Testing FULL UPGRADE path for extensions ***"
    echo "Testing UPGRADE from legacy-v1 to legacy-v2"

    npm init @rancher/extension@legacy-v2 -- --update -f

    rm -rf node_modules
    rm -rf yarn.lock

    yarn install

    yarn build-pkg test-pkg | cat

    echo "*** Testing UPGRADE from legacy-v2 to latest ***"

    echo "=> Updating node version required for last leg of upgrade path: v20"

    nvm install v20
    nvm use v20

    npm init @rancher/extension -- --migrate

    rm -rf node_modules
    rm -rf yarn.lock

    yarn install

    yarn build-pkg test-pkg | cat
  fi

  echo "Cleaning temporary dir"
  popd > /dev/null

  echo "Removing folder ${DIR}"
  rm -rf ${DIR}
}

# test creating an extension with latest shell releases + build
validate_tagged_extension_creator "legacy-v1" "v16"
validate_tagged_extension_creator "legacy-v2" "v16"
validate_tagged_extension_creator "latest" "v20"

# test update paths + build
validate_tagged_extension_creator "legacy-v1"  "v16" "true"