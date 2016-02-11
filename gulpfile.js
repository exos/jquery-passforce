
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('build', function () {
    return gulp.src('jquery.passforce.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);
