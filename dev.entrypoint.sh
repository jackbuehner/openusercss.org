#!/bin/ash
# shellcheck shell=dash
set -ex

cd /ouc
yarn --frozen-lockfile
npm rebuild node-sass node-gyp

yarn watch
