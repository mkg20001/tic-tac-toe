#!/bin/bash

set -e

rm -rf dist

npx parcel build src/index.html
