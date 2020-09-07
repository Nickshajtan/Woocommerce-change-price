/*
* compile theme js
*/
module.exports = function() {
  let gulp         = $args.gulp;
  let $            = $args.$;
  let argv         = $args.argv;
  let errorHandler = $args.errorHandler;
  let notify       = $args.notify;
  
  let notifyOptions = $args.notifyOptions;
  
  let sourcemaps   = $args.sourcemaps;
  let include      = $args.include;
  let concat       = $args.concat;
  let uglify       = $args.uglify;
  
  gulp.task('head-scripts', function() {
    return gulp
    .src('./dist/js/head/**/*.js')
    .pipe($.plumber({
              errorHandler,
    }))
    .pipe(concat('head.min.js'))
    .pipe(sourcemaps.init())
    .pipe(include({
      extensions: 'js',
      hardFail: true,
      separateInputs: true,
      includePaths: [
        __dirname + '/node_modules',
        __dirname + '/dist/js/'
      ]
    }))
    .pipe($.if(argv.minifyJs, uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/js/'));
  });

  gulp.task('body-scripts', function() {
    return gulp
    .src('./dist/js/theme/**/*.js')
    .pipe($.plumber({
              errorHandler,
    }))
    .pipe(concat('theme.min.js'))
    .pipe(sourcemaps.init())
    .pipe(include({
      extensions: 'js',
      hardFail: true,
      separateInputs: true,
      includePaths: [
        __dirname + '/node_modules',
        __dirname + '/dist/js/'
      ]
    }))
    .pipe($.if(argv.minifyJs, uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/js/'));
  });

  gulp.task('theme-scripts', gulp.series(
      'head-scripts',
      'body-scripts',
  ));

  /*
  * compile vendor js
  */
  gulp.task('vendor-scripts', function() {
    return gulp
    .src('./dist/js/vendor/**/*.js')
    .pipe($.plumber({
              errorHandler,
    }))
    .pipe(concat('vendor.min.js'))
    .pipe(sourcemaps.init())
    .pipe(include({
      extensions: 'js',
      hardFail: true,
      separateInputs: true,
      includePaths: [
        __dirname + '/node_modules',
        __dirname + '/dist/js/'
      ]
    }))
    .pipe($.if(argv.minifyJs, uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/js/'));
  });
}
