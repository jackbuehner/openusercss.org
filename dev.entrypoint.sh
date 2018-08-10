#!/bin/ash
# shellcheck shell=dash
set -ex

cd /ouc
yarn --frozen-lockfile
npm rebuild node-sass node-gyp

/usr/bin/supervisord -n -c /ouc/dev.supervisord.conf
