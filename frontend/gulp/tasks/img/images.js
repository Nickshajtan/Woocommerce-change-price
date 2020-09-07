/*
* optimize theme images
*/
module.exports = function() {
  let gulp         = $args.gulp;
  let $            = $args.$;
  let argv         = $args.argv;
  let errorHandler = $args.errorHandler;
  let notify       = $args.notify;
  
  let notifyOptions = $args.notifyOptions;
  
  let sourcemaps   = $args.sourcemaps;
  let imagemin     = $args.imagemin;
  let imageminMoz  = $args.imageminMoz;
  let imageminSvgo = $args.imageminSvgo;
  
  function svgoConfig(minify = argv.minifySvg) {
    if( argv.minifySvg ) {
      return function(file) {
          let filename = path.basename(file.relative, path.extname(file.relative));

          return {
              js2svg: {
                  pretty: !minify,
                  indent: '\t',
              },
              plugins: [
                  {
                      cleanupIDs: {
                          minify: true,
                          prefix: `${filename}-`,
                      },
                  },
                  {
                      removeTitle: true,
                  },
                  {
                      removeViewBox: false,
                  },
                  {
                      sortAttrs: true,
                  },
              ],
          };
      };
    }
    else{
      return '';
    }
  }

  gulp.task('compress-img', function(done) {
      return gulp
      .src('./dist/img/**/*', {base: './dist/img'})
      .pipe($.plumber({
              errorHandler,
      }))
      .pipe($.if(argv.debug, $.debug()))
      .pipe(sourcemaps.init())
      .pipe(imagemin([
              imagemin.gifsicle({
                  interlaced: true,
              }),
              imagemin.optipng({
                  optimizationLevel: 3,
              }),
              imageminMoz({
                  progressive: true,
                  quality: 80,
              }),
              imageminSvgo(svgoConfig(argv.minifySvg))
          ]))
      .pipe(sourcemaps.write('.'))
      .pipe($.if(argv.cache, $.newer('./public/img/')))
      .pipe($.if(argv.debug, $.debug()))
      .pipe(gulp.dest('./public/img/'))
      .on('end', done);
  });
}