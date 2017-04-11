
'use strict';

require('require-dir')('./gulp');

var gulp = require('gulp');

gulp.task('default',['build:dev'], function() {
  gulp.start('watch');
});

//Default task is going to run when Gulp is not given any parameters
//Dependencies are going to run BEFORE default task executes.
// gulp.task("default",["sass"], function(){
//   console.log('sass compiled');
//   gulp.start('watch');
// });
