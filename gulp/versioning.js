
'use strict';

var gulp = require('gulp');
var jeditor = require('gulp-json-editor');
var manifest = require('../manifest');

gulp.src("./manifest.json")
  .pipe(jeditor(function(json) {
    var versionManifest = manifest.version.split('.');

    json.version = "1.2.3";
    return json; // must return JSON object.
  }))
  .pipe(gulp.dest("./dest"));


function nextVersion (versionArray) {
  var third = parseInt(versionArray[2]);
  var second = parseInt(versionArray[1]);
  var first = parseInt(versionArray[0]);

  if (third === 9) {
    if (second < 9) {
      second++;
    } else {
      second = 0;
      first++;
    }
  }

  if (third < 9) {
    third++;
  }
}
