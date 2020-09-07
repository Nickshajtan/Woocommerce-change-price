/* 
* run task for zip compressing 
*/
module.exports = function() {
  let gulp         = $args.gulp;
  let $            = $args.$;
  let argv         = $args.argv;
  let errorHandler = $args.errorHandler;
  let notify       = $args.notify;
  
  let notifyOptions = $args.notifyOptions;
  
  function zipArchive( packageName ) {
    let name    = packageName;
	let now     = new Date();
	let year    = now.getFullYear().toString().padStart(2, '0');
	let month   = (now.getMonth() + 1).toString().padStart(2, '0');
	let day     = now.getDate().toString().padStart(2, '0');
	let hours   = now.getHours().toString().padStart(2, '0');
	let minutes = now.getMinutes().toString().padStart(2, '0');
  
    return $.zip(`${name}_${year}-${month}-${day}_${hours}-${minutes}.zip`);
  }

  gulp.task('zip:dist', function(done) {
      return gulp.src([
          './dist/**',
          '.eslintrc',
          '.gitignore',
          '.stylelintignore',
          '.stylelintrc',
          '*.js',
          '*.json',
          '*.md',
          '*.yml',
          'yarn.lock',
          '!package-lock.json',
          '!zip/**',
      ], {
          base: '.',
          dot: true,
      })
      .pipe( zipArchive('dist') )
      .pipe( gulp.dest('./zip') );
  });

  gulp.task('zip:public', function(done) {
      return gulp.src([
          './public/**',
          '!.eslintrc',
          '!.gitignore',
          '!.stylelintignore',
          '!.stylelintrc',
          '!./*.js',
          '!*.json',
          '*.md',
          '*.yml',
          './yarn.lock',
          '!package-lock.json',
          '!zip/**',
      ], {
          base: '.',
          dot: true,
      })
      .pipe( zipArchive('public') )
      .pipe( gulp.dest('./zip') );
  });

  gulp.task('zip:all', function(done) {
      return gulp.src([
          './dist/**',
          './public/**',
          '.eslintrc',
          '.gitignore',
          '.stylelintignore',
          '.stylelintrc',
          '*.js',
          '*.json',
          '*.md',
          '*.yml',
          'yarn.lock',
          '!package-lock.json',
          '!zip/**',
      ], {
          base: '.',
          dot: true,
      })
      .pipe( zipArchive( require('./').name ) )
      .pipe( gulp.dest('./zip') );
  });
}