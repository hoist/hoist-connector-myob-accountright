#!/usr/bin/env bash

set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "making timestamped deploy directory";

mkdir -p ${ROOT_CONNECTOR_DIR}/hoist-connector-myob-accountright/${TIMESTAMP}

echo "copying files to deploy directory";

cp -r . ${ROOT_CONNECTOR_DIR}/hoist-connector-myob-accountright/${TIMESTAMP}

echo "removing current symlink";

rm -f ${ROOT_CONNECTOR_DIR}/hoist-connector-myob-accountright/current

echo "relinking current symlink";

ln -s ${ROOT_CONNECTOR_DIR}/hoist-connector-myob-accountright/${TIMESTAMP} ${ROOT_CONNECTOR_DIR}/hoist-connector-myob-accountright/current

echo "removing old deploy directories";

(ls -t ${ROOT_CONNECTOR_DIR}/hoist-connector-myob-accountright/|head -n 5;ls ${ROOT_CONNECTOR_DIR}/hoist-connector-myob-accountright/)|sort|uniq -u|xargs -I '{}' rm -r ${ROOT_CONNECTOR_DIR}/hoist-connector-myob-accountright/'{}'

echo "done!";
