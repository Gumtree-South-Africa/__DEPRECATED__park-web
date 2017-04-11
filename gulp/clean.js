
'use strict';

var gulp = require('gulp');
var del = require('del');

gulp.task('clean', function() {
  console.log('Start clean');
  return del(['./build','./dist']);
});

gulp.task('clean:build', function() {
  return del(['./build/js/**', '!build/app.js', './dist/js/app.js']);
});

gulp.task('clean:configs', function() {
  return del('./dist/js/configs');
});
