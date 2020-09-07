/*
* copy resourses dir
*/
module.exports = function() {
  let gulp         = $args.gulp;
  let $            = $args.$;
  let argv         = $args.argv;
  let errorHandler = $args.errorHandler;
  let notify       = $args.notify;
  
  let notifyOptions = $args.notifyOptions;
  
  gulp.task('resourses', function(done) {
    return gulp
    .src('./dist/resourses/**/*.*', {base: './dist/resourses', dot: true,})
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
    .pipe(gulp.dest('./public/resourses/') );
  });
}