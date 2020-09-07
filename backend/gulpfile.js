/*
* run "npm install" to install all dependencies from package.json or run those manually
*
*/

'use strict';
var gulp           = require('gulp'),
    gutil          = require('gulp-util'),
    data           = require('gulp-data'),
    path           = require('path'),
    rename         = require('gulp-rename'),
    uglify         = require('gulp-uglify-es').default,
    sourcemaps     = require('gulp-sourcemaps'),
    autoprefixer   = require('gulp-autoprefixer'),
    notify         = require('gulp-notify');

var notifyOptions = {
  message : 'Error:: <%= error.message %> \nLine:: <%= error.line %> \nCode:: <%= error.extract %>'
};


/*
* compile base theme scss
*/
gulp.task('hcc-wc-styles', function(){
  return gulp
  .src('./css/**/*.css')
  .pipe(sourcemaps.init())
  .pipe(rename({suffix: '.min'}))
  .pipe(autoprefixer({ overrideBrowserslist: ['last 99 versions'], cascade: false }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./css/'));
});

/*
* compile theme js
*/
gulp.task('hcc-wc-scripts', function() {
  return gulp
  .src('./js/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(rename({suffix: '.min'}))
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./js/'));
});

gulp.task('default', gulp.parallel('hcc-wc-scripts', 'hcc-wc-styles'));