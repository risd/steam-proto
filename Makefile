BROWSERIFY = node_modules/.bin/browserify
SMASH = node_modules/.bin/smash
UGLIFY = node_modules/.bin/uglify

all: assets/js/dist assets/js/dist/d3.js assets/js/dist/site.js assets/js/dist/site.min.js

node_modules: package.json
	npm install

assets/js/dist:
	mkdir -p assets/js/dist

assets/js/dist/d3.js: node_modules node_modules/d3/*
	$(SMASH) node_modules/d3/src/start.js \
		node_modules/d3/src/core/rebind.js \
		node_modules/d3/src/core/functor.js \
		node_modules/d3/src/event/dispatch.js \
		node_modules/d3/src/event/event.js \
		node_modules/d3/src/selection/on.js \
		node_modules/d3/src/selection/select.js \
		node_modules/d3/src/selection/selectAll.js \
		node_modules/d3/src/selection/transition.js \
		node_modules/d3/src/transition/each.js \
		node_modules/d3/src/xhr/xhr.js \
		node_modules/d3/src/xhr/json.js \
		node_modules/d3/src/end.js > assets/js/dist/d3.js

assets/js/dist/site.js: assets/js/dist assets/js/dist/d3.js $(shell $(BROWSERIFY) --list assets/js/src/index.js)
	$(BROWSERIFY) assets/js/src/index.js > assets/js/dist/site.js

assets/js/dist/site.min.js: assets/js/dist/site.js
	$(UGLIFY) assets/js/dist/site.js > assets/js/dist/site.min.js