var gulp = require('gulp');
var coveralls = require('./index.js');

gulp.task('coveralls', function() {
  return gulp.src('./coverage/lcov.info')
    .pipe(coveralls());
});
