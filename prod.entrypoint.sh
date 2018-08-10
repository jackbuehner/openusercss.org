#!/bin/ash
# shellcheck shell=dash
set -ex

/usr/bin/supervisord -n -c /etc/supervisord.conf
