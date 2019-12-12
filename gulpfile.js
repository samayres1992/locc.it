var gulp = require('gulp');
var mjmlEngine = require('mjml');
var stylus = require('gulp-stylus');
var mjml = require('gulp-mjml');

gulp.task('css', function () {
    return gulp.src([
      './client/resources/stylus/app.styl',
      './client/resources/stylus/fancy-form.styl',
      './client/resources/stylus/passcode.styl',
      './client/resources/stylus/login.styl',
      './client/resources/stylus/overrides.styl'
    ])
    .pipe(stylus())
    .pipe(gulp.dest('./client/src/css/'));
});

gulp.task('mjml', function () {
  return gulp.src('./server/routes/email/**/*.mjml')
  .pipe(mjml(mjmlEngine, { minify: true }))
  .pipe(gulp.dest('./server/routes/email/'));
});
 
gulp.task('default', gulp.series('css', 'mjml'));