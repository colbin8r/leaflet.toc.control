# Leaflet.Control.NestedLayers

`Leaflet.Control.NestedLayers` is a plugin for [Leaflet](http://leafletjs.com/) similar to the native [`L.control.layers`](http://leafletjs.com/reference-1.0.3.html#control-layers) control, except that unlike the native control, `NestedLayers` permits a hierarchial structure to overlay layers. Written in ES6, it uses the ES6 class syntatic sugar instead of [Leaflet's own class framework](http://leafletjs.com/reference-1.0.3.html#class). It transpiles code down via [babel](https://babeljs.io/) (`dist/index.js`) and also includes a ready-to-use bundle via [webpack](https://webpack.github.io/) (`demo/bundle.js`).

(TODO: DEMO)

## Installation

## Usage

(TODO: DEMO)

### As a Package
If you use ES6 or higher, you can import exactly what you need for use in your own package with ES6 syntax:

```js
import { NestedLayers } from 'Leaflet.Control.NestedLayers'
```

If you use ES5 or lower with a module loader like [Browserify](http://browserify.org/), [rollup.js](https://rollupjs.org/), or [webpack](https://webpack.github.io/), you can do exactly the same thing with your module loader of choice. A pre-built bundle is available via `demo/bundle.js`.

### As a Plugin

If you want to use this package like most other Leaflet plugins (i.e. directly in the browser, maybe as a `<script>` tag), you can include the `bundle.js` on your page:

```html
<script src="./node_modules/Leaflet.Control.NestedLayers/demo/bundle.js"></script>
```

## Contributing

`NestedLayers` includes a transpilation build system via [babel](https://babeljs.io/), a bundler build system [webpack](https://webpack.github.io/), unit tests via [mocha](https://mochajs.org/) and [chai](http://chaijs.com/), coverage reporting via [istanbul and nyc](https://istanbul.js.org/), syntax/style linter via [eslint](http://eslint.org/), and API documentation generator via [documentation.js](http://documentation.js.org/).

**Quick start:**

```sh
# Clone the repo
$ git clone git@bitbucket.org:worldviewsolutions/leaflet.control.nestedlayers.git

# Install all dependencies
$ npm install

# Compile, run tests, and lint in real-time
$ npm start

# Start development :)
```

### Script Tasks

During development, it's recommended to use the main `watch` task (which is aliased to `npm start`), which will enable real-time transpilation, bundling, linting, and testing.

```sh
$ npm start
# or
$ npm run watch
```


### Building and Transpiling

```sh
# Rebuild everything
$ npm run build

# Transpile via babel
$ npm run compile

# Bundle via webpack
$ npm run pack

# Watch versions are also available
$ npm run compile:watch
$ npm run pack:watch
```

### Testing, Coverage, and Linting

The `npm test` script will lint, run tests, and check code coverage. It's the best way to verify that all the code works short of actually transpling/bundling it.

```sh
$ npm test
```

```sh
# Unit tests with code coverage
$ npm run coverage

# Just unit tests
$ npm run test:once
$ npm run test:watch
```

```sh
# Linting scripts
$ npm run lint
$ npm run lint:watch

# Only run the linter against your `.spec.js` test files:
$ npm run lint:tests
```

### Docs

Inline [JSDoc](http://usejsdoc.org/) comments can be used to generate HTML documentation (and other formats, too, [manually with `documentation`](https://github.com/documentationjs/documentation/blob/master/docs/USAGE.md)). Generated documentation lives in `/docs` and is created with [documentation.js](http://documentation.js.org/).

The linting scripts will throw errors if you are missing or have malformed inline docs. You can see a list of all valid [block tags](http://usejsdoc.org/#block-tags) that you can use in comment blocks. Since the project is written in ES6, there are some [special notes for usage with ES6](https://github.com/documentationjs/documentation/blob/master/docs/RECIPES.md).

```sh
# Generate documentation in /docs
# This is also called when you npm run build
$ npm run docs:build

# View and read the documentation live
$ npm run docs:view
```




## Author

**Colby Rogness**

* [github @colbin8r](https://github.com/colbin8r)
* [twitter @colbyrogness](http://twitter.com/colbyrogness)
* [bitbucket @colbin8r](https://bitbucket.org/colbin8r/)

## License

(TODO: LICENSE)