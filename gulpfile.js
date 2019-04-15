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

gulp.task('scripts', function () {
  return browserify('source/scripts/generated_impressions.js')
  .transform("babelify", {presets: ["@babel/preset-env"]})
  .exclude('WNdb')
  .exclude('lapack')
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer()) 
  //.pipe(uglify())
  .pipe(rename("generated_impressions.js"))
  .pipe(gulp.dest('./public/scripts/'));
});

gulp.task('scripts-prod', function () {
  return browserify('source/scripts/generated_impressions.js')
  .transform("babelify", {presets: ["@babel/preset-env"]})
  .exclude('WNdb')
  .exclude('lapack')
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer()) 
  .pipe(uglify())
  .pipe(rename("generated_impressions.js"))
  .pipe(gulp.dest('./public/scripts/'));
});

gulp.task('watch', function () {
  gulp.watch('./source/scripts/*js', gulp.series('scripts'));
  gulp.watch('./source/styles/*.scss', gulp.series('styles'));
});

gulp.task(
  'default',
  gulp.series('styles', 'scripts', 'watch')
);

gulp.task(
  'build',
  gulp.series('styles', 'scripts-prod')
);