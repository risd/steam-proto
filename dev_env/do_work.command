#!/usr/bin/env bash

## Setup environment
## -
# source /Users/<username>/.rvm/scripts/rvm
source ~/.rvm/scripts/rvm
rvm use 1.9.3
rvm gemset use edu-proto


## Change directory to application
## -
ROOT="$( dirname "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )")"

cd "$ROOT"


## Open browser
## -
open http://localhost:4001/

## Start server/sass
## -
foreman start --procfile Procfile.dev