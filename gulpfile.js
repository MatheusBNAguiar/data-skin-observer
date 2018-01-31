const gulp = require('gulp');
const eslint = require('gulp-eslint');
const jsonFormat = require('gulp-json-format');

gulp.task('lint', () => {
    gulp.src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
gulp.task('format', () => {
    gulp.src(['**/*.json'])
        .pipe(jsonFormat(4))
        .pipe(gulp.dest('.'));
});
gulp.task('default', ['lint'], () => {
});
