/*
* svg icon font
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
  
  let iconfontCss  = $args.iconfontCss;
  let fontName     = $args.fontName;
  let runTimestamp = $args.runTimestamp;
  let iconfont     = $args.iconfont;
  
  gulp.task('iconfont', function(){
    return gulp.src(['./dist/sprites/svg-font/**/*.svg'])
    .pipe($.plumber({
              errorHandler,
    }))
    .pipe(iconfontCss({
          path: './dist/scss/_mixins/_icons_template.scss',
          fontName: fontName,
          targetPath: '../../scss/_mixins/_icons.scss',
          fontPath: '../fonts/custom/'
    }))
    .pipe(iconfont({
        fontName: fontName,
        prependUnicode: true,
        formats: ['ttf', 'eot', 'woff', 'woff2'],
        timestamp: runTimestamp,
     }))
     .on('glyphs', function(glyphs, options) {
          console.log(glyphs, options);
      })
      .pipe(gulp.dest('./dist/fonts/custom/'));
  });

  /*
  * minify fonts
  */
  function minifyFont(text, cb) {
      gulp
      .src('./dist/fonts/**/*.ttf')
      .pipe($.plumber({
              errorHandler,
      }))
      .pipe(fontmin({
              text: text
      }))
      .pipe(gulp.dest('./public/fonts/'))
      .on('end', cb);
  }
  gulp.task('compress-fonts', function(cb) {
      var buffers = [];
      gulp.src('index.php')
      .on('data', function(file) {
              buffers.push(file.contents);
      })
      .on('end', function() {
              var text = Buffer.concat(buffers).toString('utf-8');
              minifyFont(text, cb);
      });
  });

  /*
  * copy fonts dir
  */
  gulp.task('copy-dir-fonts', function(done) {
      return gulp
      .src('./dist/fonts/**/*.*')
      .on('data', function(file){  
              console.log({
                  contents: file.contents,                 
                  path: file.path,                         
                  cwd: file.cwd,                           
                  base: file.base,                         
                  // path component helpers                
                  relative: file.relative,                 
                  dirname: file.dirname,                   
                  basename: file.basename,                 
                  stem: file.stem,                         
                  extname: file.extname   
              });                 
      })   
      .pipe($.plumber({
              errorHandler,
      }))
      .pipe(gulp.dest('./public/fonts/') );
  });

  gulp.task('fonts-styles', function(){
    return gulp
    .src('./dist/fonts/fonts.css')
    .pipe($.plumber({
              errorHandler,
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: argv.minifyCss ? 'compressed' : 'nested' }).on('error',  notify.onError(notifyOptions)))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 99 versions'], cascade: false }))
    .pipe(concat('fonts.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/fonts/'));
  });
}