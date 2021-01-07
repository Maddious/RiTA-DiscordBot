[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

# @kollavarsham/gulp-coveralls

[Gulp](https://github.com/gulpjs/gulp) plugin to submit code coverage to [Coveralls](http://coveralls.io). (Fork of the unmaintained [gulp-coveralls](https://github.com/markdalgleish/gulp-coveralls) - thank you, [@markdalgleish](https://github.com/markdalgleish))

## Usage

First, install `@kollavarsham/gulp-coveralls` as a dev dependency:

```bash
$ npm install --save-dev @kollavarsham/gulp-coveralls
```

Then, add it to your `gulpfile.js`:

```javascript
var coveralls = require('@kollavarsham/gulp-coveralls');

gulp.src('test/coverage/**/lcov.info')
  .pipe(coveralls());
```

## License

[MIT License](https://kollavarsham.org/LICENSE.txt) ([Original License](http://markdalgleish.mit-license.org))

[npm-url]: https://www.npmjs.com/package/@kollavarsham/gulp-coveralls
[npm-image]: https://img.shields.io/npm/v/@kollavarsham/gulp-coveralls.svg?style=flat-square

[travis-url]: http://travis-ci.org/kollavarsham/gulp-coveralls
[travis-image]: https://img.shields.io/travis/kollavarsham/gulp-coveralls/master.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/kollavarsham/gulp-coveralls
[coveralls-image]: https://img.shields.io/coveralls/kollavarsham/gulp-coveralls/master.svg?style=flat-square

[depstat-url]: https://david-dm.org/kollavarsham/gulp-coveralls
[depstat-image]: https://img.shields.io/david/kollavarsham/gulp-coveralls/master.svg?style=flat-square
