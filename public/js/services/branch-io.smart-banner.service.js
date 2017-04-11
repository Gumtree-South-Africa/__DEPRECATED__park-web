(function() {
  'use strict';

  function SmartBanner ($cookies, $rootScope, $compile, $q, $timeout) {
    'ngInject';

    var BRANCH_KEY = appConfig.smartBanner.branchId;
    var smartBanner = {};
    var COOKIE_SMART_BANNER_TIME = 'VIVA_COOKIE_SMART_BANNER_TIME';
    var isBannerDisplayed = false;
    var idBranchTag = '#branch-banner-iframe';
    var idBranchCloseTag = '#branch-banner-close1';
    var DAY_TIME = 86400000; // 24hrs
    // var DAY_TIME = 600000; // 10 min

    if (!window.branch) {
      console.err('Branch IO doesn\'t exist');
      smartBanner.initBanner = function() {};
      smartBanner.showBanner = function() {};
      smartBanner.hideBanner = function() {};
      smartBanner.closeBanner = function() {};
      smartBanner.sendSms = function() {};
      smartBanner.isVisible = function() {};
      return smartBanner;
    }

    smartBanner.initBanner = initBanner;
    smartBanner.showBanner = showBanner;
    smartBanner.hideBanner = hideBanner;
    smartBanner.sendSms = sendSms;
    smartBanner.isVisible = isVisible;

    function initBanner () {
      var deferred = $q.defer();
      window.branch.init(BRANCH_KEY, function(err, data) {

        if (err) {
            console.error(err);
            deferred.reject(err);
            initBI = false;
          }

        $(idBranchCloseTag)
        .click(function() {
            var d = new Date();
            $cookies.put(COOKIE_SMART_BANNER_TIME, d.getTime(), {
            expires: new Date(d.getTime() + DAY_TIME)
          });
        });
        deferred.resolve('branch io init');
      });
      return deferred.promise;
    }

    function showBanner ( ) {
      var shouldShowBanner = $cookies.get(COOKIE_SMART_BANNER_TIME);
      if (!shouldShowBanner && !isBannerDisplayed) {
        setBanner();
        isBannerDisplayed = true;
      }
    }

    function hideBanner () {
      if (!$(idBranchTag).length) {
        $timeout(hideBanner,100);
      } else {
        if (!isBannerDisplayed) {
          $(idBranchTag).css('margin-top','-76px');
          $(idBranchTag).css('display','none');
          $('body').css('margin-top','0px');
        } else {
          $(idBranchTag).animate({
          'marginTop': '-76px'
        },200);
        $('body').animate({
          'marginTop': '0px'
        },400);
        }

        isBannerDisplayed = false;
      }
    }

    function sendSms ( ) {

    }

    function setBanner () {
      if (!$(idBranchTag).length) {
        $timeout(setBanner,100);
      } else {
        if (isBannerDisplayed) {
          $(idBranchTag).css('display','block');
          $(idBranchTag).css('margin-top','0px');
          $('body').css('margin-top','76px');
        } else {
          $(idBranchTag).css('display','block');
          $(idBranchTag).animate({
          'marginTop': '0px'
        },200);
        $('body').animate({
          'marginTop': '76px'
        },500);
        }
      }
    }

    function isVisible () {
      return isBannerDisplayed;
    }

    return smartBanner;
  }

  angular.module('app.services')
  .service('SmartBanner', SmartBanner);

}());
