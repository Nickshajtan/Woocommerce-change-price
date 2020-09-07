/*
* compile theme scss
*/
module.exports = function() {
  let gulp         = $args.gulp;
  let $            = $args.$;
  let argv         = $args.argv;
  let errorHandler = $args.errorHandler;
  let notify       = $args.notify;
  
  let notifyOptions = $args.notifyOptions;
  
  let sourcemaps   = $args.sourcemaps;
  let autoprefixer = $args.autoprefixer;
  let concat       = $args.concat;
  
  let sass = $args.sass;
  let scss = $args.scss;
  
  gulp.task('head-styles', function(){
      return gulp
      .src('./dist/scss/head/**/*.scss')
      .pipe($.plumber({
			errorHandler,
      }))
      .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: argv.minifyCss ? 'compressed' : 'nested' }).on('error',  notify.onError(notifyOptions)))
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({ overrideBrowserslist: ['last 99 versions'], cascade: false }))
      .pipe(concat('head-styles.min.css'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/css/'));
  });

  gulp.task('body-styles', function(){
        return gulp
        .src('./dist/scss/theme/**/*.scss')
        .pipe($.plumber({
              errorHandler,
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: argv.minifyCss ? 'compressed' : 'nested' }).on('error',  notify.onError(notifyOptions)))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 99 versions'], cascade: false }))
        .pipe(concat('theme-styles.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public/css/'));
  });

  gulp.task('theme-styles', gulp.series(
      'head-styles',
      'body-styles',
  ));

  /*
  * compile vendor scss
  */
  gulp.task('vendor-styles', function(){
        return gulp
        .src(['./dist/scss/vendor/**/*.scss', './dist/scss/vendor/css/**/*.css'])
        .pipe($.plumber({
              errorHandler,
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: argv.minifyCss ? 'compressed' : 'nested' }).on('error',  notify.onError(notifyOptions)))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 99 versions'], cascade: false }))
        .pipe(concat('vendor-styles.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public/css/'));
  });
}
