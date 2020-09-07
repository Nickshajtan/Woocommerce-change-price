/*
* svg sprite
*/
module.exports = function() {
  let gulp         = $args.gulp;
  let $            = $args.$;
  let argv         = $args.argv;
  let errorHandler = $args.errorHandler;
  let notify       = $args.notify;
  
  let notifyOptions = $args.notifyOptions;
  let svgsprite     = $args.svgsprite;
  
  gulp.task('svg-sprite', function () {
        return gulp.src('./dist/sprites/svg/*.svg', {base: './dist/sprites/svg'})
        .pipe($.plumber({
              errorHandler,
        }))
        .pipe($.if(argv.debug, $.debug()))
        .pipe($.cheerio({
              run: function ($) {
                  $('[fill]').removeAttr('fill');
                  $('[stroke]').removeAttr('stroke');
                  $('[style]').removeAttr('style');
              },
              parserOptions: {xmlMode: true}
          }))
        .pipe($.if(!argv.minifySvg, $.replace('&gt;', '>')))
        .pipe($.if(!argv.minifySvg, $.replace(/^\t+$/gm, '')))
        .pipe($.if(!argv.minifySvg, $.replace(/\n{2,}/g, '\n')))
        .pipe($.if(!argv.minifySvg, $.replace('?><!', '?>\n<!')))
        .pipe($.if(!argv.minifySvg, $.replace('><svg', '>\n<svg')))
        .pipe($.if(!argv.minifySvg, $.replace('><defs', '>\n\t<defs')))
        .pipe($.if(!argv.minifySvg, $.replace('><symbol', '>\n<symbol')))
        .pipe($.if(!argv.minifySvg, $.replace('></svg', '>\n</svg')))
        .pipe(svgsprite({
        mode: {
             shape: {
                dimension: {
                  maxWidth: 32,
                  maxHeight: 32
                },
                spacing: {
                  padding: 10
                },
             },
             view: {
                bust: false,
                render: {
                  scss: true
                }
              },
              symbol: {
                  sprite: "../img/sprite.svg",
                  render: {
                      scss: {
                          dest:'../symbol/_svg-sprite.scss',
                      }
                  }
              }
          }
          }))
          .pipe(gulp.dest('./dist/resourses/svg/'));

  });
}