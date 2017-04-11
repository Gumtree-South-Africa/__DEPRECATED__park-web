(function() {
  'use strict';

  function UtilsService ($state) {

    var service = this;

    this.$formatURLString = function (string, limit) {
      var mustLimit = typeof limit !== 'undefined';
      if (string == undefined || string == '' || typeof string !== 'string') {
        string = '';
      } else {
        var strlength = string.length;
        if (mustLimit && strlength > limit) {
          string = string.substring(0, limit);
        }
        string = string.toLowerCase();
        string = string.replace(/[\!|\"|\#|\$|\%|\&|'|\(|\)|\*|\+|\,|\\|\.|\/|\:|\;|\<|\=|\>|\!|\¿|\?|\@|\[|\||\]|\^|\`|\{|\||\}|\~]/gi, '');
        string = string.replace(/[\_|]/gi, '-')
        string = string.replace(/[\á|\ä|\à|\â|\Á|\Ä|\À|\Â]/gi, 'a');
        string = string.replace(/[\é|\è|\ë|\ê|\É|\Ë|\È|\Ê]/gi, 'e');
        string = string.replace(/[\í|\ì|\ï|\î|\Í|\Ï|\Ì|\Î]/gi, 'i');
        string = string.replace(/[\ó|\ò|\ö|\ô|\Ó|\Ö|\Ò|\Ô]/gi, 'o');
        string = string.replace(/[\ú|\ù|\ü|\û|\Ú|\Ü|\Ù|\Û]/gi, 'u');
        string = string.replace(/[\ñ|\Ñ]/gi, 'n');
        string = string.replace(/(?:\uD83C[\uDF00-\uDFFF])|(?:\uD83D[\uDC00-\uDDFF])/gi, '-');
        string = string.trim().replace(/\ |\t|\r|\n|\v|\f/gi, '-').replace(/[\-]{2,}/, '-');
      }
      return string;
    };

    this.isLocalStorageAvailable = function () {
      var close5 = 'close5';
      try {
        localStorage.setItem(close5, close5);
        localStorage.removeItem(close5);
        return true;
      } catch (e) {
        return false;
      }
    };

    this.newMetadata = function (currentMetaData, newMetadata) {
      var cmc = angular.copy(currentMetaData);
      var keys = Object.keys(newMetadata);
      keys.forEach(function (k) {
        cmc[k] = newMetadata[k];
      });
      return cmc;
    };

    this.newMetadataPromise = function (currentMetaData, newMetadataPromise) {
      var self = this;
      return newMetadataPromise.then(function (newMetadata) {
        return self.newMetadata(currentMetaData, newMetadata);
      });
    };

    this.range = function (from, limit) {
      var to = limit - 1;
      var d = [];
      var c = to - from + 1;
      while (c--) {
        d[c] = to--
      }
      return d;
    };

    this.isRunningOnMobile = function () {
      return !!(navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
    // Remove Firefox, it's included only to validate on dev
    || navigator.userAgent.match(/Mobile/i));
    };

    this.isUndefinedOrNull = function (obj) {
      return !angular.isDefined(obj) || obj === null;
    };
    this.isUndefinedOrEmptyString = function (thing) {
      return (typeof thing === "undefined") ? true : thing === null || thing.length === 0;
    };
    this.splitArray = function (array, n) {
      var ta = [];
      for (var i = 0; i < array.length; i += n) {
        ta.push(array.slice(i, i + n));
      }
      return ta;
    };

    this.transpose = function (array) {
      if (array.length === 0) {
        return array;
      } else {
        return array[0].map(function (col, i) {
          return array.map(function (row) {
            return row[i];
          });
        });
      }
    }
    this.defaultUserPicture = function () {
      return "../../../images/vivanuncios/avatar_ph_3.svg";
    }
    this.isScrolled = false;

    this.getItemsUrl = function (items) {
          items.forEach(function(item) {
            var url = decodeURIComponent($state.href('item', {itemCategory: item.category.name, itemName: item.name, itemId: item.id}));
            var urlSplitted = url.split('/');
            item.vivaUrl = 'pr/' + service.$formatURLString(urlSplitted[2]) + '/' + service.$formatURLString(urlSplitted[3]) + '/' + urlSplitted[4];
          });
        }

    this.getItemUrl = function (item) {
      var url = decodeURIComponent($state.href('item', {itemCategory: item.category.name, itemName: item.name, itemId: item.id}));
      var urlSplitted = url.split('/');
      return 'pr/' + service.$formatURLString(urlSplitted[2]) + '/' + service.$formatURLString(urlSplitted[3]) + '/' + urlSplitted[4];
    }
  }

  angular.module('app.services')
  .service('UtilsService', UtilsService);

}());

