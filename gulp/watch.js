
'use strict';

var gulp = require('gulp');

gulp.task('watch', function() {

  gulp.watch(['./src/jade/*.jade'], ['make:jade:views']);
  gulp.watch(['./src/jade/partials/*.jade'], ['make:jade:partials']);
  gulp.watch(['./src/jade/error/*.jade'], ['make:jade:error']);

  gulp.watch(['./public/js/*.js'],
    ['make:configs:dev']);

  gulp.watch(['./public/js/controllers/*.js'],
    ['make:controllers:dev']);

  gulp.watch(['./public/js/services/*.js'],
    ['make:services:dev']);

  gulp.watch(['./public/js/filters/*.js'],
    ['make:filters:dev']);

  gulp.watch(['./public/js/directives/*.js'],
    ['make:directives:dev']);

  gulp.watch(['public/scss/*.scss', 'public/scss/**/*.scss'],
    ['make:sass']);

  gulp.watch(['public/index.html'],['copy:index', 'inject:index:bowerJS', 'inject:index:appJS'])

  gulp.watch(['public/views/**'], ['copy:partials']);
});
