
'use strict';

var gulp = require('gulp');
var inject = require('gulp-inject');
var paths = require('../dependencies.js');
var angularFilesort = require('gulp-angular-filesort');

gulp.task('inject:index:appJS', function() {
  var target = gulp.src('./dist/index.html');
  var sources = gulp.src(paths.appJs).pipe(angularFilesort());

  return target.pipe(inject(sources, {
          transform: function(filepath) {
            var distPath = 'dist/';
            var distIndex = filepath.indexOf(distPath);
            var distLength = distPath.length;

            if(distIndex >= 0) {
              filepath = filepath.slice(distIndex+distLength);
              return '<script src="' + filepath + '"></script>'
            }

            return inject.transform.apply(inject.transform, arguments);
          }
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('inject:index:bowerJS', function() {
  var target = gulp.src('./dist/index.html');
  var sources = gulp.src(paths.bowerJs);

  return target.pipe(inject(sources, {
          name: 'bower',
          transform: function(filepath) {
            var bowerPath = 'bower_components';
            var bowerIndex = filepath.indexOf(bowerPath);
            var bowerLength = bowerPath.length;

            if (bowerIndex >= 0) {
              filepath = filepath.slice(bowerIndex+bowerLength);
              return '<script src="libs' + filepath + '"></script>'

            }

            return inject.transform.apply(inject.transform, arguments);
          }
        }))
        .pipe(gulp.dest('./dist'));
});
