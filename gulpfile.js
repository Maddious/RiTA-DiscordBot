const gulp = require("gulp");
const eslint = require("gulp-eslint");
const watch = require("gulp-watch");
const lec = require("gulp-line-ending-corrector");
const coveralls = require('@kollavarsham/gulp-coveralls');
//const uglify = require('gulp-uglify-es').default;

//tasks

function lint()
{
   //execute
   return gulp.src(["src/**/*.js"])
      .pipe(lec())
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
}

function compress()
{
   // execute
   return gulp.src("src/**/*.js")
   //.pipe(uglify())
      .pipe(gulp.dest("build"));
}
gulp.task("compress", compress);
gulp.task("lint", lint);
gulp.task("watch", GulpWatch);
gulp.task("default", gulp.parallel(lint, compress));
gulp.task("build", gulp.parallel(lint, compress));
function GulpWatch()
{
   gulp.watch("src/**/*.js", gulp.series("default"));
}

gulp.task('coveralls', function (done) {
  if (!process.env.CI) {
    done();
  } else {
    return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
      .pipe(coveralls());
  }
});

gulp.src('test/coverage/**/lcov.info')
  .pipe(coveralls());
