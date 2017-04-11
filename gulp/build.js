
'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');


gulp.task('build:dev', function() {
  runSequence('clean',
              ['make:jade:partials', 'make:jade:views', 'make:jade:error'],
              ['make:controllers:dev', 'make:directives:dev', 'make:services:dev', 'make:filters:dev', 'make:configs:dev' , 'make:routes:dev'],
              'make:sass',
              'copy:partials',
              'copy:index',
              'copy:fonts',
              'copy:images',
              'inject:index:appJS',
              'inject:index:bowerJS'
  );
});

gulp.task('build:prod', function() {
  runSequence('clean',
              ['make:jade:partials', 'make:jade:views', 'make:jade:error'],
              ['make:controllers', 'make:directives', 'make:services', 'make:filters', 'make:configs', 'make:routes'],
              'make:js',
              'clean:build',
              'make:sass',
              'copy:partials',
              'copy:index',
              'copy:fonts',
              'copy:images',
              'inject:index:bowerJS',
              'inject:index:appJS'
  );
});
