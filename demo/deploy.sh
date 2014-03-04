#!/bin/bash

source ~/.nvm/nvm.sh

# install dependencies
bower install

# force compilation of all assets
nvm use 0.10
`npm bin`/grunt build

cp -r bower_components ../formstamp.github.io/
cp -r build ../formstamp.github.io/
cp -r demo ../formstamp.github.io/
cp index.html ../formstamp.github.io/
