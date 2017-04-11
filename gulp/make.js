
'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    dependencies = require('../dependencies');
var minify = require('gulp-minify');
var angularFilesort = require('gulp-angular-filesort');
var jade = require('gulp-jade');

gulp.task('make:sass', function () {
  console.log('compiling sass files.. please wait');
  return gulp.src(dependencies.css)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('make:controllers', function() {
  return gulp.src('public/js/controllers/*.js')
    .pipe(ngAnnotate({
      remove: true,
      add: true,
      single_quotes: true
    }))
    .pipe(gulp.dest('./build/js/controllers/'));
});

gulp.task('make:directives', function() {
  return gulp.src('public/js/directives/*.js')
    .pipe(ngAnnotate({
      remove: true,
      add: true,
      single_quotes: true
    }))
    .pipe(gulp.dest('./build/js/directives/'));
});

gulp.task('make:services', function() {
  return gulp.src('public/js/services/*.js')
    .pipe(ngAnnotate({
      remove: true,
      add: true,
      single_quotes: true
    }))
    .pipe(gulp.dest('./build/js/services/'));
});

gulp.task('make:filters', function() {
  return gulp.src('public/js/filters/*.js')
    .pipe(ngAnnotate({
      remove: true,
      add: true,
      single_quotes: true
    }))
    .pipe(gulp.dest('./build/js/filters/'));
});

gulp.task('make:configs', function() {
  return gulp.src('public/js/*.js')
    .pipe(ngAnnotate({
      remove: true,
      add: true,
      single_quotes: true
    }))
    .pipe(gulp.dest('./build/js/configs/'));
});

gulp.task('make:routes', function() {
  return gulp.src('public/js/routes/*.js')
    .pipe(ngAnnotate({
      remove: true,
      add: true,
      single_quotes: true
    }))
    .pipe(gulp.dest('./build/js/routes/'));
});

gulp.task('make:configs:dev', function() {
  return gulp.src('public/js/*.js')
    .pipe(ngAnnotate({
      remove: true,
      add: true,
      single_quotes: true
    }))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('make:routes:dev', function() {
  return gulp.src('public/js/routes/*.js')
    .pipe(ngAnnotate({
      remove: true,
      add: true,
      single_quotes: true
    }))
    .pipe(gulp.dest('./dist/js/routes/'));
});

gulp.task('make:js', function() {
  return gulp.src('build/js/**/*.js')
    .pipe(angularFilesort())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./build/'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'))
    .pipe(minify())
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('make:controllers:dev', function() {
  return gulp.src('public/js/controllers/*.js')
    .pipe(ngAnnotate({
      remove: true,
      add: true,
      single_quotes: true
    }))
    .pipe(gulp.dest('./dist/js/controllers/'));
});

gulp.task('make:directives:dev', function() {
  return gulp.src('public/js/directives/*.js')
    .pipe(ngAnnotate({
      remove: true,
      add: true,
      single_quotes: true
    }))
    .pipe(gulp.dest('./dist/js/directives/'));
});

gulp.task('make:services:dev', function() {
  return gulp.src('public/js/services/*.js')
    .pipe(ngAnnotate({
      remove: true,
      add: true,
      single_quotes: true
    }))
    .pipe(gulp.dest('./dist/js/services/'));
});

gulp.task('make:filters:dev', function() {
  return gulp.src('public/js/filters/*.js')
    .pipe(ngAnnotate({
      remove: true,
      add: true,
      single_quotes: true
    }))
    .pipe(gulp.dest('./dist/js/filters/'));
});

gulp.task('make:jade:views', function() {
  return gulp.src('./src/jade/*.jade')
    .pipe(jade({
        pretty: true
      }))
    .pipe(gulp.dest('./public/views/'));
});

gulp.task('make:jade:partials', function() {
  return gulp.src('./src/jade/partials/*.jade')
    .pipe(jade({
        pretty: true
      }))
    .pipe(gulp.dest('./public/views/partials/'));
});

gulp.task('make:jade:error', function() {
  return gulp.src('./src/jade/error/*.jade')
    .pipe(jade({
        pretty: true
      }))
    .pipe(gulp.dest('./public/views/error/'));
});
