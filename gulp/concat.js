
'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('concat:controllers', function() {
  return gulp.src('./build/js/controllers/*.js')
    .pipe(concat('app.controllers.js'))
    .pipe(gulp.dest('./build/js/controller'));
});

gulp.task('concat:directives', function() {
  return gulp.src('./build/js/directives/*.js')
    .pipe(concat('app.directives.js'))
    .pipe(gulp.dest('./build/js/directive'));
});

gulp.task('concat:services', function() {
  return gulp.src('./build/js/services/*.js')
    .pipe(concat('app.services.js'))
    .pipe(gulp.dest('./build/js/service'));
});

gulp.task('concat:filters', function() {
  return gulp.src('./build/js/filters/*.js')
    .pipe(concat('app.filters.js'))
    .pipe(gulp.dest('./build/js/filter'));
});

gulp.task('concat:configs', function() {
  return gulp.src('./build/js/configs/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./build/js/config'));
});

gulp.task('concat:routes', function() {
  return gulp.src('./build/js/routes/*.js')
    .pipe(concat('app-routes.js'))
    .pipe(gulp.dest('./build/js'));
});
