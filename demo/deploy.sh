#!/bin/bash

# formstamp.github.io deploy script
# run it from repository root

set +e # break script on first error
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
cp README.md ../formstamp.github.io/

cd ../formstamp.github.io
git add .
git commit -a -m "deploy at `date` by `whoami`"
git push origin master
