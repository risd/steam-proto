#!/usr/bin/env bash

## Install rvm if no rvm
## -
hash rvm 2>/dev/null || {
    \curl -L https://get.rvm.io | bash

    source ~/.rvm/scripts/rvm
}


## Prep for ruby install on 10.7
## -
rvm get stable
rvm autolibs homebrew


## Install ruby
## -
rvm install 1.9.3
rvm use 1.9.3


## Create a gemset (env) for edu-proto
## -
rvm gemset create steam-proto
rvm gemset use steam-proto


## Install bundler to install gems
## -
gem install bundler


## Change directory to application
## -
ROOT="$( dirname "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )")"

cd "$ROOT"


## Install gems
## -
bundle install