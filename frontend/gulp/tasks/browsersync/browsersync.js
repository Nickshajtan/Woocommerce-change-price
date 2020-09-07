/*
* live reload
*/
module.exports = function() {
  let argv = $args.argv;
  let $    = $args.$;
  
  global.$args.browserSync = function browserSync(done) {
    let middleware = [];

	if (argv.spa) {
		middleware.push($.connectHistoryApiFallback());
	}

	$.browserSync.create().init({
        //Domen name or main directory ( choose server or proxy )
        open: argv.open,
        port: argv.port,
        files: [
				'./public/**/*',
        ],
        server: {
            baseDir: "./public", //server + /sync-options = settings 
            middleware,
        },  
        notify: false,
	});
    done();
  }

  global.$args.browserSyncReload = function browserSyncReload() {
    $.browserSync.reload();
  }
}