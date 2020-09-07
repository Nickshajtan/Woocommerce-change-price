/*
* run "npm install" to install all dependencies from package.json or run those manually
*
*/

'use strict';
/* --- dependencies --- */
global.$args = {
  gulp:            require('gulp'),
  gutil:           require('gulp-util'),
  data:            require('gulp-data'),
  path:            require('path'),
  pug:             require('gulp-pug'),
  sass:            require('gulp-sass'),
  concat:          require('gulp-concat'),
  uglify:          require('gulp-uglify-es').default,
  sourcemaps:      require('gulp-sourcemaps'),
  autoprefixer:    require('gulp-autoprefixer'),
  fontmin:         require('gulp-fontmin'),
  imagemin:        require('gulp-imagemin'),
  imageminMoz:     require('imagemin-mozjpeg'),
  imageminSvgo:    require('imagemin-svgo'),
  svgmin:          require('gulp-svgmin'),
  iconfont:        require('gulp-iconfont'),
  iconfontCss:     require('gulp-iconfont-css'),
  svgsprite:       require('gulp-svg-sprite'),
  spritesmith:     require('gulp.spritesmith'),
  cheerio:         require('gulp-cheerio'),
  replace:         require('gulp-replace'),
  merge:           require('merge-stream'),
  notify:          require('gulp-notify'),
  yargs:           require('yargs'),
  plumber:         require('gulp-plumber'),
  newer:           require('gulp-newer'),
  gulpif:          require('gulp-if'),
  gulpLoadPlugins: require('gulp-load-plugins'),
  bem:             require('pug-bem'),
  include:         require('gulp-include'),

  path: {
    tasks: require('./gulp/config/tasks.js')
  },
};

// element separator
global.$args.bem.e = 'string';
// modifier separator
global.$args.bem.m = 'string';

global.$args.runTimestamp = Math.round(Date.now()/1000);
global.$args.fontName     = 'custom-svgFont';

global.$args.$ = $args.gulpLoadPlugins({
	overridePattern: false,
	pattern: [
		'browser-sync',
		'emitty',
		'merge-stream',
		'stylelint',
		'stylelint-scss',
		'stylelint-order',
		'stylelint-declaration-block-no-ignored-properties',
		'gulp-stylelint',
		'vinyl-buffer',
		'append-prepend',
        'postcss-reporter',
        'postcss-scss',
        'gulp-postcss',
        'gulp-newer',
        'gulp-debug',
        'gulp-if',
        'gulp-pug-linter',
        'emitty',
        'svgstore',
        'gulp-gm',
	],
	scope: [
		'dependencies',
		'devDependencies',
		'optionalDependencies',
		'peerDependencies',
	],
});

/* --- vars & settings --- */
global.$args.notifyOptions = {
  message : 'Error:: <%= error.message %> \nLine:: <%= error.line %> \nCode:: <%= error.extract %>'
};

/*
 * Yargs vars
 *
 */
global.$args.argv = $args.yargs.default({
	cache: false,
	debug: true,
	fix: false,
	minifyHtml: null,
	minifyCss: null,
	minifyJs: null,
	minifySvg: null,
	notify: true,
	open: true,
	port: 3000,
	spa: false,
	throwErrors: false,
    retina: false,
    retinaManual: true,
    resizeSize: false,
    resizeArr: null,
    bem: false,
}).argv;

let argv = $args.argv;

argv.minify     = !!argv.minify;
argv.minifyHtml = argv.minifyHtml !== null  ? !!argv.minifyHtml : argv.minify;
argv.minifyCss  = argv.minifyCss  !== null  ? !!argv.minifyCss  : argv.minify;
argv.minifyJs   = argv.minifyJs   !== null  ? !!argv.minifyJs   : argv.minify;
argv.minifySvg  = argv.minifySvg  !== null  ? !!argv.minifySvg  : argv.minify;
argv.retina     = Boolean( argv.retina );
argv.resizeSize = Boolean( argv.resizeSize ) !== false ? argv.resizeSize   : ( argv.resizeArr !== null ) ? argv.resizeArr : false;

if (argv.ci) {
	argv.cache       = false;
	argv.notify      = false;
	argv.open        = false;
	argv.throwErrors = true;
}

if (argv.throwErrors) {
	global.$args.errorHandler = false;
} else if (argv.notify) {
	global.$args.errorHandler = $args.$.notify.onError('<%= error.message %>');
} else {
	global.$args.errorHandler = null;
}

/*
 * Include modules
 *
 */
$args.path.tasks.forEach(function(taskPath){
  require(taskPath)();
});

$args.gulp.task('default', $args.gulp.parallel('watch-theme', 'copy-dir-fonts', 'resourses', 'fonts-styles', 'iconfont', 'copy-html', $args.browserSync));