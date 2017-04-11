(function() {
  'use strict';

  function BranchIoService ($q, $translate, $cookies) {
    'ngInject';

    var initBI = false;
    var bannerOpen = false;
    var forHomeInit = false;
    var jsmiliseconds= 0;
    var bannerDayTime = 86400000;
    var currentSec = 0;
    var d = 0;

    var initPromise = function () {
      var deferred = $q.defer();
      if (!initBI) {
        (function (b, r, a, n, c, h, _, s, d, k) {
          if (!b[n] || !b[n]._q) {
            for (; s < _.length;)c(h, _[s++]);
            d = r.createElement(a);
            d.async = 1;
            d.src = "https://cdn.branch.io/branch-v1.8.8.min.js";
            k = r.getElementsByTagName(a)[0];
            k.parentNode.insertBefore(d, k);
            b[n] = h
          }
        })(window, document, "script", "branch", function (b, r) {
          b[r] = function () {
            b._q.push([r, arguments])
          }
        }, {
          _q: [],
          _v: 1
        }, "init data setIdentity logout track link sendSMS referrals credits redeem banner".split(" "), 0);
        initBI = true;
        branch.init(appConfig.smartBanner.branchId, function (err, data) {
          if (err) {
            console.error(err);
            deferred.reject(err);
            initBI = false;
          }
          //console.log('initiate session');
          deferred.resolve('branch io init');
          branch.addListener('didShowBanner', function () {
            $('#branch-banner-iframe').contents().find('#branch-banner-close').click(function () {
              var smartbannerCookie = $cookies.getObject('closeSmartBanner');
              if(smartbannerCookie){
                d = new Date();
                jsSec = d.getTime();
                currentSec = jsSec - smartbannerCookie;
                //console.log('Closed: ' + currentSec + ' mlsec ago');
                if(currentSec > bannerDayTime){
                  var d = new Date();
                  jsmiliseconds = d.getTime();
                  $cookies.put('closeSmartBanner',jsmiliseconds);
                }

              }else{
                //console.log('Creating smart banner cookie');
                var d = new Date();
                jsmiliseconds = d.getTime();
                $cookies.put('closeSmartBanner',jsmiliseconds);
              }

            });
          });
        });
      } else {
        deferred.resolve('branch io init');
      }
      return deferred.promise;
    };

    var closeBanner = function () {
      if (initBI && bannerOpen) {
        bannerOpen = false;
        branch.closeBanner();
      }
    };

    var getDataParam = function (dataType, params) {
      var defaultData = {
        phone: appConfig.smartBanner.phone,
        tags: ['app share'],
        feature: 'app share (web)',
        stage: 'new user',
        type: 1,
        data: {
          referrerAction: 'app share',
          action: 'app share',
          $always_deeplink: true
        }
      };
      switch (dataType) {
        case 'user':
          defaultData['data']['userId'] = params.userId;
          defaultData['data']['action'] = 'user share';
          defaultData['data']['referrerAction'] = 'user share';
          defaultData['tags'] = ['user'];
          defaultData['feature'] = 'user profile share (web)';
          defaultData['$og_title'] = params.userName;
          defaultData['$og_image_url'] = params.userImage;
          break;
        case 'item':
          defaultData['data']['itemId'] = params.itemId;
          defaultData['data']['action'] = 'item share';
          defaultData['data']['referrerAction'] = 'item share';
          defaultData['tags'] = ['item'];
          defaultData['feature'] = 'item share (web)';
          defaultData['$og_title'] = 'For sale';
          defaultData['$og_image_url'] = params.itemImage;
          defaultData['$og_description'] = params.itemDescription;
          break;
        case 'app':
          //console.log('default open the app');
          break;
        case 'home':
          //console.log('default open the app');
          break;
        default:
          //console.log('option not recognized');
          break;
      }
      return defaultData;
    };

    var showBanner = function (bannerType, params) {
      if(shallShowBanner()){
        initPromise().then(function () {
          bannerOpen = true;
          var configForBanner = {
            icon: '/images/app-icon.png',
            title: '', //TODO: configure smart banner title
            description: '',
            openAppButtonText: 'Open',
            downloadAppButtonText: 'Download',
            iframe: true,
            showiOS: true,
            showAndroid: true,
            showDesktop: true,
            disableHide: false,
            forgetHide: true,
            make_new_link: true
          };

          var data = getDataParam(bannerType, params);

          if (bannerType === 'home') {
            if(!forHomeInit){
              branch.banner(configForBanner, data);
              forHomeInit = true;
            }
          } else {
            forHomeInit = false;
            branch.banner(configForBanner, data);
          }
        });
      }
    };

    var shallShowBanner = function(){
      var smartbannerCookie = $cookies.getObject('closeSmartBanner');
      if(smartbannerCookie){
        d = new Date();
        jsSec = d.getTime();
        currentSec = jsSec - smartbannerCookie;
        if(currentSec > bannerDayTime){
          return true;
        }else{
          return false
        }
      }else{
        return true;
      }
    };

    var sendSMS = function (phoneNumber, smsType, params) {
      initPromise().then(function () {
        branch.sendSMS(
          phoneNumber,
          {
            tags: ['sms', smsType],
            channel: 'web',
            feature: 'dashboard',
            stage: 'new user',
            data: getDataParam(smsType, params)
          },
          { make_new_link: true },
          function(err) {
            console.error(err);
          }
        );
      });
    };

    return {
      closeBanner: closeBanner,
      showBanner: showBanner,
      sendSMS: sendSMS,
      getFollowUserLink: function (userId, userName, userImageUrl, isMobile) {
        return initPromise().then(function () {
          return $q(function (resolve, reject) {
            branch.link({
              tags: ['user'],
              feature: 'user profile share (web)',
              stage: 'new user',
              type: 1,
              data: {
                action: 'user share',
                referrerAction: 'user share',
                userId: userId
              }
            }, function (err, link) {
              if (err) {
                reject(errr);
              }
              resolve(link);
            });
          });
        });
      },
      getDownloadLink: function () {
        return initPromise().then(function () {
          return $q(function (resolve, reject) {
            branch.link({
              tags: ['download'],
              feature: 'donwload app (web)',
              stage: 'new user',
              type: 1,
              data: {
                action: 'app share',
                referrerAction: 'app share',
                $always_deeplink: true
              }
            }, function (err, link) {
              if (err) {
                reject(errr);
              }
              resolve(link);
            });
          });
        });
      },

        // TODO: set all this up when branch.io integration is avaiulable
      getMakeAnOfferLink: function (itemId, itemDescription, itemImageUrl) {
        return initPromise().then(function () {
          return $q(function (resolve, reject) {
            var data = {
              action: '',
              referrerAction: '',
              itemId: itemId,
              $og_title: '',
              $og_description: itemDescription,
              $og_image_url: itemImageUrl,
              $always_deeplink: true
            };
            branch.link({
              tags: [''],
              feature: '',
              stage: '',
              type: 1,
              data: data
            }, function (err, link) {
              if (err) {
                reject(errr);
              }
              resolve(link);
            });
          });
        });
      }
    }
  }

  angular.module('app.services')
  .service('BranchIoService', BranchIoService);
}());

