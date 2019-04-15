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
var inject = require('gulp-inject-string');

var exec = require('child_process').exec;
var seedSetter = callHashFile();
var seed;
var ready = false;

function setSeed(hash) {
  seed = hash.slice(0, 7);
  ready = true;
}

function callHashFile() {
  return exec('git rev-parse HEAD');
}

seedSetter.stdout.on('data', function (data) {
  setSeed(data);
  console.log(seed);
});

gulp.task('hash', function() {
  return gulp.src('source/index.html')
      .pipe(inject.replace('{{ hash }}', seed))
      .pipe(rename('index.html'))
      .pipe(gulp.dest('public'));
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
  gulp.series('styles', 'scripts', 'hash', 'watch')
);

gulp.task('build', function() {
  gulp.series('styles', 'scripts-prod', 'hash');
});