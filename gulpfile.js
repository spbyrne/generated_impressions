var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var prefixer = require('gulp-autoprefixer');
var fs = require('fs');
var browserify = require("browserify");
var babelify = require('babelify');
var source = require("vinyl-source-stream");
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');

gulp.task('scripts', function () {
  return browserify('source/scripts/anna-bernard.js')
  .transform("babelify", {presets: ["@babel/preset-env"]})
  .exclude('WNdb')
  .exclude('lapack')
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer()) 
  .pipe(rename("anna-bernard.js"))
  .pipe(gulp.dest('./public/scripts/'));
});

gulp.task('styles', function () {
  var sassOptions = {
    outputStyle: 'expanded'
  };
  var prefixerOptions = {
    browsers: ['last 4 versions']
  };
  return gulp
    .src('source/styles/*.scss')
    .pipe(sass(sassOptions))
    .pipe(prefixer(prefixerOptions))
    .pipe(csso())
    .pipe(gulp.dest('public/styles/'));
});

gulp.task('watch', function () {
  gulp.watch('./source/scripts/*-source.js', gulp.series('scripts'));
  gulp.watch('./source/styles/*.scss', gulp.series('styles'));
});

gulp.task(
  'default',
  gulp.series('styles', 'scripts', 'watch')
);

gulp.task(
  'build',
  gulp.series('styles', 'scripts')
);