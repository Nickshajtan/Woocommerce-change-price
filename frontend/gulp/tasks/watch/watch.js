/* 
* run task for continuous track of theme files 
*/
module.exports = function() {
  let gulp         = $args.gulp;
  let $            = $args.$;
  
  let browserSyncReload = $args.browserSyncReload;
  gulp.task('watch-theme', function() {
     gulp.watch(['./dist/scss/**/*.scss', './dist/scss/*.scss', '!./dist/scss/vendor/**/*.scss', '!./dist/scss/vendor/*.scss'],   gulp.series('theme-styles')).on( 'change', browserSyncReload );
     gulp.watch(['./dist/scss/vendor/**/*.scss', './dist/scss/vendor/**/*.css'],   gulp.series('vendor-styles')).on( 'change', browserSyncReload );
     gulp.watch('./dist/fonts/fonts.css',  gulp.series('fonts-styles', 'copy-dir-fonts')).on( 'change', browserSyncReload );
     gulp.watch('./dist/js/**/*.js',  gulp.series('theme-scripts', 'vendor-scripts')).on( 'change', browserSyncReload );
     gulp.watch(['./dist/img/**/*.*', './dist/img/*.*'], gulp.series('compress-img')).on( 'change', browserSyncReload );
     gulp.watch('./dist/*.html', gulp.series('copy-html')).on( 'change', browserSyncReload );
     gulp.watch(['./dist/sprites/img/**/*.*', './dist/sass/_mixins/_img-sprite.scss'], gulp.series('img-sprite')).on( 'change', browserSyncReload );
     gulp.watch(['./dist/sprites/svg/*.svg', './dist/sass/_mixins/_svg-sprite.scss'], gulp.series('svg-sprite')).on( 'change', browserSyncReload );
     gulp.watch('./dist/views/**/*.pug', {delay: 0,}, gulp.series('pug')).on( 'change', browserSyncReload ).on('all', function(event, file){
       if (event === 'unlink') {
         global.$args.emittyPugChangedFile = undefined;
       } else {
         global.$args.emittyPugChangedFile = file;
       }
     });
  });
}