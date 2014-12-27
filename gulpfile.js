/**
 * Open exe
 Minify JS
 Sass to Css
 Minify Css
 Build windows
 Build mac
 Build linux
 build all
 */

var gulp = require('gulp'),
    shell = require('gulp-shell'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    sass = require('gulp-sass');

gulp.task('default', ['buildDev']);

gulp.task('buildProd', ['scssToCss', 'minifyCss', 'concatJS','openApp']);
gulp.task('buildDev', ['scssToCss', 'concatJS','openApp']);

gulp.task('openApp', function () {
    gulp.src('nw/nw.exe', {read: true})
        .pipe(shell(['<%= file.path %> ./']));
});

gulp.task('concatJS', function () {
    gulp.src(['app/*', 'app/shared/*/*.js', 'app/components/*/*.js'])
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
        .pipe(gulp.dest(''));
});