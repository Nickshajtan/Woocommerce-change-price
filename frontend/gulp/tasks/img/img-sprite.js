/*
* images sprite
*/
module.exports = function() {
  let gulp         = $args.gulp;
  let $            = $args.$;
  let argv         = $args.argv;
  let errorHandler = $args.errorHandler;
  let notify       = $args.notify;
  
  let notifyOptions = $args.notifyOptions;
  
  let spritesmith = $args.spritesmith;
  let merge       = $args.merge;
  
  let imgSpriteSrc;
  let spriteSettings;
  
  function gmResize(gmfile, done) {
    if( Boolean( argv.resizeSize ) === false ) {
        if( argv.resizeArr[0] !== null && argv.resizeArr[0] !== undefined && argv.resizeArr[1] !== null && argv.resizeArr[1] !== undefined ) {
          gmfile.resize(argv.resizeArr[0], argv.resizeArr[1]);
        }
        else {
          return '';
        }
    }
    else {
        gmfile.size(function handleSize (err, size) {
          if (err) { 
            return done(err); 
          }
          if (size.width % 2 === 0 && size.height % 2 === 0) {
            return done(null, gmfile);
          }
          return done(null, gmfile
            .background('transparent')
            .gravity('northwest')
            .extent(size.width + (size.width % 2), size.height + (size.height % 2)));
        });
    }
  }
  gulp.task('resize-images', function resizeImages () {
    return gulp.src('./dist/sprites/img/*@2.*')
      .pipe($.gm(function handleGm (gmfile, done) {
          gmResize(gmfile, done)
      }, {
        //imageMagick: true
      }))
      .pipe(gulp.dest('./dist/sprites/img/'));
  });

  gulp.task('img-sprite', function () {
    spriteSettings = {
      cssName: '_img-sprite.scss',
      padding: 5,
    };
    if( Boolean( argv.retina ) === true ) {
      spriteSettings['retinaSrcFilter'] = ['!./dist/sprites/img/*.*', './dist/sprites/img/*@2.*', './dist/sprites/img/*@x2.*', './dist/sprites/img/*@2x.*'];
      spriteSettings['retinaImgName']   = 'sprite@2x.png';
      spriteSettings['retinaImgPath']   = '../img/sprite@2x.png';
    }

    if( Boolean( argv.retinaManual ) === true ) {
      imgSpriteSrc = ['!./dist/sprites/img/*.*', './dist/sprites/img/*@2.*', './dist/sprites/img/*@x2.*', './dist/sprites/img/*@2x.*'];
      spriteSettings['imgName']   = 'sprite@2x.png';
      spriteSettings['imgPath']   = '../img/sprite@2x.png';
    }
    else {
      imgSpriteSrc = ['./dist/sprites/img/*.*', '!./dist/sprites/img/*@2.*', '!./dist/sprites/img/*@x2.*', '!./dist/sprites/img/*@2x.*'];
      spriteSettings['imgName']   = 'sprite.png';
      spriteSettings['imgPath']   = '../img/sprite.png'
    }

    const spriteData = gulp.src( imgSpriteSrc, {base: './dist/sprites'}).pipe($.plumber({
              errorHandler,
    }))
    .pipe($.if(argv.debug, $.debug()))
    .pipe(spritesmith(spriteSettings));

    // Pipe image stream onto disk
    const imgStream = spriteData.img
      .pipe(gulp.dest('./public/img/'));

    // Pipe CSS stream onto disk
    const cssStream = spriteData.css
      .pipe(gulp.dest('./dist/scss/_mixins/'));

    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream);
  });
}
