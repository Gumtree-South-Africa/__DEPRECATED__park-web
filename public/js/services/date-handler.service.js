(function() {
  'use strict';

  function DateHandler () {

    this.formattDateToLastRequest = formattDateToLastRequest;
    this.formattDateToPostTime = formattDateToPostTime;
    this.stringDateToEpoc = stringDateToEpoc;

    /*
      return yyyyMMddThhmmssZ
    */
    function formattDateToLastRequest (date) {
      var year = date.getFullYear().toString();
      var month = (date.getMonth() + 1).toString() ;
      var day = date.getDate().toString();
      var hour = date.getHours().toString();
      var min = date.getMinutes().toString();
      var sec = date.getSeconds().toString();
      var timeZone = date.getTimezoneOffset();
      var timeZoneStr = timeZone.toString().replace('-','');
      timeZoneStr = timeZoneStr.length < 4
                    ? '0' + timeZoneStr
                    : timeZoneStr;

      return year +
                (month.length > 1
                  ? month
                  : '0' + month)
       + day + 'T' + hour +
                (min.length > 1
                  ? min
                  : '0' + min)
       + sec +
                (timeZone < 0
                  ? '-' + timeZoneStr
                  : '+' + timeZoneStr);
    }

    function formattDateToPostTime (time) {
      var dateUTC = getUTCDate(time);
      var month = getMonth(dateUTC.getMonth());
      var day = dateUTC.getDate();
      var year = dateUTC.getFullYear().toString();

      return isPast5min(time)  ? 'Hace un momento' : day + ' ' + month + ' ' + year;
    }

    function timeToDateString (time) {
      return
    }

    function stringDateToEpoc (date) {
      var dateIso = date.toISOString();
      var parts = dateIso.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
      return Date.UTC(+parts[1], +parts[2]-1, +parts[3], +parts[4], +parts[5], +parts[6]);
    }

    function isPast5min (time) {
      var dateChat = getUTCDate(time);
      var dateCurrent = new Date();
      var minChat = dateChat.getMinutes();
      var dayChat = dateChat.getDate();
      var monthChat = dateChat.getMonth();
      var yearChat = dateChat.getFullYear();
      var hourChat = dateChat.getHours();

      var minCurrent = dateCurrent.getMinutes();
      var dayCurrent = dateCurrent.getDate();
      var hourCurrent = dateCurrent.getHours();
      var monthCurrent = dateCurrent.getMonth();
      var yearCurrent = dateCurrent.getFullYear();

      return yearChat === yearCurrent
      && monthChat === monthCurrent
      && dayChat === dayCurrent
      && hourChat == hourCurrent
      && (parseInt(minCurrent) - parseInt(minChat)) < 5
    }

    function getUTCDate (time) {
      var dateUTC = new Date(0);
      dateUTC.setUTCSeconds(time);
      return dateUTC;
    }

    function getMonth (month) {
      var monthFormatt = '';
      switch (month) {
        case 0:
          monthFormatt = 'Ene';
          break;
        case 1:
          monthFormatt = 'Feb';
          break;
        case 2:
          monthFormatt = 'Mar';
          break;
        case 3:
          monthFormatt = 'Abr';
          break;
        case 4:
          monthFormatt = 'May';
          break;
        case 5:
          monthFormatt = 'Jun';
          break;
        case 6:
          monthFormatt = 'Jul';
          break;
        case 7:
          monthFormatt = 'Ago';
          break;
        case 8:
          monthFormatt = 'Sep';
          break;
        case 9:
          monthFormatt = 'Oct';
          break;
        case 10:
          monthFormatt = 'Nov';
          break;
        case 11:
          monthFormatt = 'Dic';
          break;
      }

      return monthFormatt;
    }

  }

  angular.module('app.services')
  .service('DateHandler', DateHandler);
}());
