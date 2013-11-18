To work on this project, ensure dependencies are installed. 

## HTML/(S)CSS

- Double click `dev_env/setup.command` to setup environment (ruby/gems)
- Double click `do_work.command` to run have `jekyll` and `sass` continually compiling html and css.

## JavaScript

Requires [node][node], and [fswatch][fswatch].

- run `npm install` from the root directory.
- Double click `do_work.command` to continually compile the site. This initiaites `jekyll`/`sass`/`make` (using `browserify`)

If there are problems with the `LGTM` package in the make build process, try changing the `main` value in `node_modules/lgtm/package.json` to `"main": "dist/commonjs/lgtm.js"`. This may not be included in the npm package, so check out the [lgtm repository][lgtm-repository] for the commonjs source.


[lgtm-repository]:https://github.com/square/lgtm
[node]:http://nodejs.org/
[fswatch]:https://github.com/alandipert/fswatch