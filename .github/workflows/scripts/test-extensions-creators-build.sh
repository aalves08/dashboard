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

  # these two commands will allow for NVM to work in bash, since it's included in ubuntu-latest
  export NVM_DIR=~/.nvm
  source ~/.nvm/nvm.sh

  DIR=$(mktemp -d)
  pushd $DIR > /dev/null

  echo "*** ***************************************** ***"
  echo "*** Verifying extension creator for tag ::: ${TAG} ***"
  echo "*** ***************************************** ***"
  echo "Using temporary directory ${DIR}"

  echo "=> Setting up node version required for this env: ${NODE_VERSION}"
  echo "=> Current dir 1:"
  ls
  echo "=> Current dir 2:"
  pwd

  # setting up correct version of node  
  nvm install ${NODE_VERSION}
  nvm use ${NODE_VERSION}

  # generate skeleton app
  npm init @rancher/extension@${TAG} test-pkg --app-name test-app | cat

  pushd test-pkg > /dev/null

  # install dependencies
  yarn install

  # test build of pkg inside skeleton app
  yarn build-pkg test-pkg | cat

  echo "=> Current dir 3:"
  ls
  echo "=> Current dir 4:"
  pwd

  if [ $UPDATE == "true" ]; then
    echo "*** ***************************************** ***"
    echo "*** Testing FULL UPGRADE path for extensions ***"
    echo "*** ***************************************** ***"
    echo "=> Testing UPGRADE from legacy-v1 to legacy-v2"

    echo "=> Current dir 5:"
    ls
    echo "=> Current dir 6:"
    pwd

    git init

    echo "=> Current dir 7:"
    ls
    echo "=> Current dir 8:"
    pwd

    npm init @rancher/extension@legacy-v2 --update

    rm -rf node_modules
    rm -rf yarn.lock

    yarn install

    yarn build-pkg test-pkg | cat

    echo "*** ***************************************** ***"
    echo "*** Testing UPGRADE from legacy-v2 to latest ***"
    echo "*** ***************************************** ***"

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
# validate_tagged_extension_creator "legacy-v1" "v16"
# validate_tagged_extension_creator "legacy-v2" "v16"
# validate_tagged_extension_creator "latest" "v20"

# test update paths + build
validate_tagged_extension_creator "legacy-v1"  "v16" "true"