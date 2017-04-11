

'use strict';

var gulp = require('gulp');

gulp.task('copy:css', function() {
  return gulp.src('./public/css/*.css')
          .pipe(gulp.dest('./dist/css'));
});

gulp.task('copy:fonts', function() {
  return gulp.src(['./public/fonts/*', './public/fonts/**/*'])
          .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('copy:images:favico', function() {
  return gulp.src('./public/images/*.ico')
          .pipe(gulp.dest('./dist/images'));
});

gulp.task('copy:images', function() {
  return gulp.src(['./public/images/**'])
          .pipe(gulp.dest('./dist/images'));
});

gulp.task('copy:partials', function() {
  return gulp.src(['./public/views/*.html','./public/views/**/*.html'])
          .pipe(gulp.dest('./dist/views'));
});

gulp.task('copy:index', function() {
  return gulp.src('./public/index.html')
          .pipe(gulp.dest('./dist'));
});

gulp.task('copy:js:local', function() {
  return gulp.src(['./build/js/**', '!./build/js/configs'])
          .pipe(gulp.dest('./dist/js'));
});

gulp.task('copy:js:configs', function() {
  return gulp.src('./build/js/configs/**')
          .pipe(gulp.dest('./dist/js'));
});

gulp.task('copy:js:qa', function() {
  return gulp.src('./build/app.js')
          .pipe(gulp.dest('./dist/js'));
});
