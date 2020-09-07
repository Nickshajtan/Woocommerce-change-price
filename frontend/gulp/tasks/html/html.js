/*
* copy html files
*/
module.exports = function() {
  let gulp         = $args.gulp;
  let $            = $args.$;
  let argv         = $args.argv;
  let errorHandler = $args.errorHandler;
  let notify       = $args.notify; 
  
  let notifyOptions = $args.notifyOptions;
  
  let pug = $args.pug;
  let emittyPug;
  
  gulp.task('copy-html', function(done) {
      return gulp
      .src('./dist/**/*.html')
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
      .pipe($.if(argv.cache, $.newer('./public')))
      .pipe($.if(argv.debug, $.debug()))
      .pipe(gulp.dest('./public/') );
  });

  /*
  * compile pug files
  */
  gulp.task('pug', function() {
    var options = {pretty: argv.minifyHtml ? false : '\t',}
    if( argv.bem !== false ) {
      options['plugins'] = ['[bem]'];
    }
    if (!emittyPug) {
          emittyPug = $.emitty.setup('./dist/views/pages', 'pug', {
              makeVinylFile: true,
          });
     }

    if (!argv.cache) {
          return gulp.src(['./dist/views/pages/**/*.pug', './dist/views/pages/*.pug'])
              .pipe($.plumber({
                  errorHandler,
              }))
              .pipe($.if(argv.debug, $.debug()))
              .pipe(pug(options))
              .pipe(gulp.dest('./public/'));
      }

      return new Promise( function(resolve, reject) {
          emittyPug.scan(global.emittyPugChangedFile).then( function() {
              gulp.src(['./dist/views/pages/**/*.pug', './dist/views/pages/*.pug'])
                  .pipe($.plumber({
                      errorHandler,
                  }))
                  .pipe(emittyPug.filter(global.emittyPugChangedFile))
                  .pipe($.if(argv.debug, $.debug()))
                  .pipe($.pug({
                      pretty: argv.minifyHtml ? false : '\t',
                  }))
                  .pipe(gulp.dest('./public/'))
                  .on('end', resolve)
                  .on('error', reject);
          });
      });
  });
}