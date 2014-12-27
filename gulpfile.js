var gulp = require('gulp'),
    open = require('gulp-open'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css');

gulp.task('default', ['concatJS','openExe']);

gulp.task('openExe', function () {
    gulp.src('nw.exe')
        .pipe(open());
});

gulp.task('concatJS', function () {
    gulp.src(['app/*', 'app/components/*/*.js', 'app/shared/*/*.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('assets/js/'));
});

gulp.task('minifyCss', function () {
    gulp.src('assets/sass/main.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('assets/css'));
});