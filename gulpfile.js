var gulp = require('gulp'),
    shell = require('gulp-shell'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    nwBuilder = require("node-webkit-builder"),
    gutil = require("gulp-util"),
    os = require("os"),
    path = require("path");
var clean = require('gulp-clean');

/**
 * Get the platform we're on. 
 * @return {String|null} node-webkit platform string in which we are running.
 */
var currentPlatform = function() {
    switch (os.platform() + os.arch()) {
        case 'linuxx64'  : return 'linux64';
        case 'linuxx84'  : return 'linux32';
        case 'darwinx64' : return 'osx64';
        case 'darwinx84' : return 'osx32';
        case 'win64x64'  : return 'win64';
        case 'win32x84'  : return 'win32';
        default:
            return null;
    }
};

var nwpath = function(platform) {
    if (!platform) platform = PLATFORM;

    var part = path.resolve('./cache/' + Globals.nwVersion + '/' + platform)
                   .replace(' ', '\\ ')

    switch (currentPlatform()) {
        case 'linux64':
        case 'linux32':
            return part + '/nw'
        case 'osx64': 
        case 'osx32':
            return part + '/node-webkit.app/Contents/MacOS/node-webkit' 
        case 'win64': 
        case 'win32': 
            return part + '/nw.exe'
        default:
            return null;
    }
}



const PLATFORM = false || currentPlatform(); // Pass wanted platform all/osx32/osx64/win32/win6/linux32/linux64

var Globals = {
    "nwVersion" : "0.11.3"
};



gulp.task('default', ['buildDev']);
gulp.task('buildFirst', ['scssToCss', 'minifyCss', 'concatJS', 'nwBuild', 'openApp']);
gulp.task('buildDev', ['scssToCss', 'concatJS', 'openApp']);

gulp.task('nwBuild', function () {
    var nw = new nwBuilder({
        version : Globals.nwVersion,
        files : ["./app/**", "./assets/**", "./node_modules/**", "./package.json", "./index.html", "!./assets/sass/**"],
        platforms : (!PLATFORM || PLATFORM == 'all' ? ['osx32', 'osx64', 'linux32', 'linux64', 'win32', 'win64'] : [PLATFORM])
    }).on('log', function (msg) { gutil.log('node-webkit-builder', msg) });
    return nw.build().catch(function (err) {
        gutil.log('node-webkit-builder', err);
    });
});

gulp.task('clean', function () {  
  return gulp.src('build', {read: false})
    .pipe(clean());
});

gulp.task('openApp', shell.task([
  nwpath() + ' ./'
]));

gulp.task('concatJS', function () {
    gulp.src(['app/**/*.js', 'assets/js/**/*.js', '!assets/js/main.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('assets/js/'));
});

gulp.task('scssToCss', function () {
    gulp.src('assets/sass/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('assets/css'));
});

gulp.task('minifyCss', function () {
    gulp.src('assets/css/main.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('assets/css'));
});
