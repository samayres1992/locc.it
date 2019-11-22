var gulp = require('gulp');
var update = require('gulp-update')();
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');


gulp.task('css', function () {
    return gulp.src([
      './resources/stylus/app.styl',
      './resources/stylus/fancy-form.styl',
      './resources/stylus/passcode.styl',
      './resources/stylus/overrides.styl'
    ])
    .pipe(stylus())
    .pipe(gulp.dest('./src/css/'));
});
 
gulp.task('default', gulp.series('css'));