#!/bin/bash

set -e

rm -rf dist

npx parcel build --public-url ./ src/index.html
