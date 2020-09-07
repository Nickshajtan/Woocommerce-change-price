/* 
* lint tasks
*/
module.exports = function() {
  let gulp         = $args.gulp;
  let $            = $args.$;
  let argv         = $args.argv;
  let errorHandler = $args.errorHandler;
  let notify       = $args.notify;
  
  let notifyOptions = $args.notifyOptions;
  
  gulp.task('lint:pug', function(){
      return gulp.src([
          './dist/views/**/*.pug',
      ])
      .pipe($.plumber({
              errorHandler,
      }))
      .pipe($.pugLinter({
              failAfterError: !!argv.throwErrors,
      }));
  });

  gulp.task('lint:scss', function() {
      return gulp.src([
          './dist/scss/**/*.scss',
          '!./dist/scss/_mixins/**/*.scss',
          '!./dist/scss/_variables/**/*.scss',
          '!./dist/scss/_vars.scss',
          '!./dist/scss/_mixins.scss',
          './dist/fonts/fonts.css',
          './dist/fonts/**/*.css',
          './dist/fonts/**/*.scss',
          '!./dist/scss/**/*.css',
          '!./dist/scss/**/*.min.css',
      ])
      .pipe($.plumber({
              errorHandler,
      }))
      .pipe($.postcss([
              $.stylelint(),
              $.postcssReporter({
                  clearReportedMessages: true,
                  throwError: argv.throwErrors,
              }),
      ], {
              parser: $.postcssScss,
      }));
  });

  gulp.task('lint:js', function() {
      return gulp.src([
          './dist/js/**/*.js',
          '!./dist/js/**/*.min.js',
      ], {
          base: '.',
      })
      .pipe($.plumber({
              errorHandler,
      }))
      .pipe($.eslint({
              fix: argv.fix,
      }))
      .pipe($.eslint.format())
      .pipe($.if( function(file){file.eslint && file.eslint.fixed}, gulp.dest('.')));
  });

  gulp.task('lint', gulp.series(
      'lint:pug',
      'lint:scss',
      'lint:js'
  ));
}