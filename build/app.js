(function() {
  'use strict';

  AppRun.$inject = ['$auth', '$rootScope', 'UtilsService', 'SmartBanner', '$state', 'NegotiationFactory'];
  function AppRun ($auth, $rootScope, UtilsService, SmartBanner, $state, NegotiationFactory) {
    'ngInject';

    var chLS = function () {
      var close5 = 'close5';
      try {
        localStorage.setItem(close5, close5);
        localStorage.removeItem(close5);
        return true;
      } catch(e) {
        return false;
      }
    };
    if (chLS() && typeof localStorage.close5Cities3 !== 'undefined') {
      localStorage.removeItem('close5Cities3');
    }
    try {
      var uername = $auth.getPayload().username;
      NegotiationFactory.startServiceListOffers();
    } catch (err) {
      // using old token or not logged
      $auth.logout();
    }
    // $FB.init(appConfig.facebook.appId);

    SmartBanner.initBanner()
    .then(function () {
      if(UtilsService.isRunningOnMobile()) {
          if (    $state.is('homeLocation')
              ||  $state.is('search.keyword')
              ||  $state.is('search.keywordCategory')
              ||  $state.is('searchCategory')
              ||  $state.is('item')
            )
          {
              SmartBanner.showBanner();
          } else {
            SmartBanner.hideBanner();
          }
        } else {
          if ($state.is('item')) {
            SmartBanner.showBanner();
          } else {
            SmartBanner.hideBanner();
          }
        }
    });

    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams, options){

        angular.forEach(toParams,function (value,key) {
          if (typeof value === "string") {
            toParams[key] = UtilsService.$formatURLString(value.toLowerCase());
          }
        });

      });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

      window.scrollTo(0, 0);

      if (!NegotiationFactory.isServiceRunning() && $auth.isAuthenticated()) {
          NegotiationFactory.startServiceListOffers();
        }

        if (NegotiationFactory.isServiceRunning() && !$auth.isAuthenticated()) {
          NegotiationFactory.stopServiceListOffers();
        }

      if(UtilsService.isRunningOnMobile()) {
          if (   toState.name == 'homeLocation'
              || toState.name == 'search.keyword'
              || toState.name == 'search.keywordCategory'
              || toState.name == 'searchCategory'
              || toState.name == 'item'
            )
          {
              SmartBanner.showBanner();
          } else {
            SmartBanner.hideBanner();
          }
        } else {
          if (toState.name === 'item') {
            SmartBanner.showBanner();
          } else {
            SmartBanner.hideBanner();
          }
        }
    });
  }

  angular.module('app.services', []);
  angular.module('app.controllers', ['ngSanitize']);
  angular.module('app.directives', []);
  angular.module('app.filters', []);

  angular.module('vivaApp',
    [
    'ui.router',
    'leaflet-directive',
    'djds4rce.angular-socialshare',
    'ngCookies',
    'door3.css',
    'pascalprecht.translate',
    'app.controllers',
    'app.directives',
    'app.filters',
    'app.services',
    'ncy-angular-breadcrumb',
    'afkl.lazyImage',
    'matchMedia',
    'angulartics',
    //'angulartics.google.tagmanager',
    'angulartics.google.analytics',
    'ui.bootstrap',
    'ngTouch',
    'angularMoment',
    'ui.bootstrap.tpls',
    'satellizer',
    'ngclipboard',
    'infinite-scroll'
    ])
  .run(AppRun);

}());

(function() {
  'use strict';

  UserAppRoutes.$inject = ['$stateProvider'];
  function UserAppRoutes ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('group',
        {
          url: '/gr/:groupName/:groupId',
          templateUrl: 'views/group.html',
          controller: 'GroupController'
        })
      .state('userProfile',
        {
          url: '/profile/:id',
          templateUrl: 'views/user-profile.html',
          controller: 'UserProfileController'
        })
      .state('userProfileName',
        {
          url: '/:username/users/:id',
          templateUrl: 'views/user-profile.html',
          controller: 'UserProfileController'
        })
      .state('verifyAccount',
        {
          abstract: true,
          url: '/signup/verify',
          template: '<ui-view>'
        })
      .state('verifyAccount.success',
        {
          url:'/success',
          templateUrl: '/views/statics/verify-account-success.html'
        })
      .state('verifyAccount.error',
          {
            url:'/error',
            templateUrl: '/views/statics/verify-account-error.html'
          })

  }

  angular.module('vivaApp')
  .config(UserAppRoutes);

}());

(function() {
  'use strict';

  StaticAppRoutes.$inject = ['$stateProvider'];
  function StaticAppRoutes ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('statics',
        {
          abstract: true,
          url: '/statics',
          template: '<ui-view>'
        })
      .state('statics.about',
        {
          url: '/about',
          templateUrl: 'views/statics/about.html'
        })
      .state('statics.communityRules',
        {
          url: '/communityRules',
          templateUrl: 'views/statics/community-rules.html'
        })
      .state('statics.support',
        {
          url: '/support',
          templateUrl: 'views/statics/support.html'
        })
      .state('statics.legalDisclosures',
        {
          url: '/legalDisclosures',
          templateUrl: 'views/statics/legal-disclosures.html'
        })

      .state('underConstruction',
        {
          url: '/under-construction',
          templateUrl: 'views/under-construction.html'
        });
  }

  angular.module('vivaApp')
  .config(StaticAppRoutes);

}());

(function() {
  'use strict';

  SearchAppRoutes.$inject = ['$stateProvider'];
  function SearchAppRoutes ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('search',
        {
          abstract: true,
          url: '/s/{locationId:[a-zA-Z\-]{1,}\-[a-zA-Z\-]{1,}}',
          template: '<ui-view>',
          resolve: {
            'locationResponse' : ['LocationService', '$stateParams', function (LocationService, $stateParams) {
              return LocationService.getCityById($stateParams.locationId);
            }]
          }
        })
      .state('search.keyword',
        {
          url: '/{keyword:[^/]*}',
          views: {
            '@': {
              templateUrl: 'views/search-results.html',
              controller: 'SearchByKeywordController'
            }
          },
          resolve: {
            'itemsFounded' : ['locationResponse', 'AdsItemService', '$stateParams', function (locationResponse, AdsItemService, $stateParams) {
              var requestOption = {
                q: $stateParams.keyword,
                page: 0,
                pageSize: 10,
                latitude: locationResponse.latitude,
                longitude: locationResponse.longitude,
                radius: 20,
                order: 'published,nearest'
              };
              return AdsItemService.searchPublic(requestOption);
            }]
          },
          reloadOnSearch: false
        })
      .state('search.keywordCategory',
        {
          url: '/{keyword:[^/]*}/:categoryId',
          views: {
            '@': {
              templateUrl: 'views/search-results.html',
              controller: 'SearchByKeywordController'
            }
          },
          resolve: {
            'itemsFounded' : ['locationResponse', 'AdsItemService', 'CategoryService', '$stateParams', function (locationResponse, AdsItemService, CategoryService, $stateParams) {
              var requestOption = {
                q: $stateParams.keyword,
                categoryId: CategoryService.codesToIds[$stateParams.categoryId],
                page: 0,
                pageSize: 10,
                latitude: locationResponse.latitude,
                longitude: locationResponse.longitude,
                radius: 20,
                order: 'published,nearest'
              };
              return AdsItemService.searchPublic(requestOption);
            }]
          },
          reloadOnSearch: false
        })
      .state('searchCategory',
        {
          url: '/c/{locationId:[a-zA-Z\-]{1,}\-[a-zA-Z\-]{1,}}/:categoryId',
          views: {
            '@': {
              templateUrl: 'views/search-results.html',
              controller: 'SearchByKeywordController'
            }
          },
          resolve: {
            'locationResponse' : ['LocationService', '$stateParams', function (LocationService, $stateParams) {
              return LocationService.getCityById($stateParams.locationId);
            }],
            'itemsFounded': ['locationResponse', 'AdsItemService', 'CategoryService', '$stateParams', function (locationResponse, AdsItemService, CategoryService, $stateParams) {
              var requestOption = {
                categoryId: CategoryService.codesToIds[$stateParams.categoryId],
                page: 0,
                pageSize: 10,
                latitude: locationResponse.latitude,
                longitude: locationResponse.longitude,
                radius: 20,
                order: 'published,nearest'
              };
              return AdsItemService.searchPublic(requestOption);
            }]
          },
          reloadOnSearch: false
        });

  }

  angular.module('vivaApp')
  .config(SearchAppRoutes);

}());

(function() {
  'use strict';

  NegotiationAppRoutes.$inject = ['$stateProvider'];
  function NegotiationAppRoutes ($stateProvider) {
    'ngInject';


    $stateProvider
      .state('negotiationsList',
      {
        url: '/negotiation/list',
        templateUrl: 'views/viva-negotiaions-list.html',
        controller: 'NegotiationsListController',
        resolve: {
          'isLogged' : ['$auth', '$state', '$q', function($auth, $state, $q) {
            var deferred = $q.defer();
            deferred.resolve($auth.isAuthenticated());
            return deferred.promise.then(function(flag) {
              if (!flag) {
                $state.go('error.userAccessRestricted');
              }
            });
          }],
          'conversationsBuyer' : ['NegotiationFactory', function(NegotiationFactory) {
            return NegotiationFactory.getOffersBuyer({page: 0, pageSize: 24, count: 0}, false);
          }],
          'conversationsSeller' : ['NegotiationFactory', function(NegotiationFactory) {
            return NegotiationFactory.getOffersSeller({page: 0, pageSize: 24, count: 0}, false);
          }]
        }
      })
      .state('negotiationsListItem',
      {
        url: '/negotiation/list/:idItem',
        templateUrl: 'views/viva-negotiations-list-item.html',
        controller: 'NegotiationsListItemController',
        resolve: {
          'isLogged' : ['$auth', '$state', '$q', function($auth, $state, $q) {
            var deferred = $q.defer();
            deferred.resolve($auth.isAuthenticated());
            return deferred.promise.then(function(flag) {
              if (!flag) {
                $state.go('error.userAccessRestricted');
              }
            });
          }],
          'ListConversations' : ['NegotiationFactory', '$stateParams', function(NegotiationFactory,$stateParams) {
            return NegotiationFactory.getListItemConversations($stateParams.idItem);
          }],
          'IdItem' : ['$stateParams', function($stateParams) {
            return $stateParams.idItem;
          }]
        }
      })
      .state('negotiationItem',
        {
          url: '/negotiation/item/:idItem',
          templateUrl: 'views/viva-chat-negotiation.html',
          controller: 'NegotiationController',
          resolve: {
            'isLogged' : ['$auth', '$state', '$q', function($auth, $state, $q) {
              var deferred = $q.defer();
              deferred.resolve($auth.isAuthenticated());
              return deferred.promise.then(function(flag) {
                if (!flag) {
                  $state.go('error.userAccessRestricted');
                }
              });
            }],
            'Item': ['AdsItemService', '$stateParams', '$state', '$auth', '$q', function (AdsItemService, $stateParams, $state, $auth, $q) {
              return AdsItemService.find($stateParams.idItem)
              .then(function(res) {
                if (res.statusCode === 1) {
                  return res;
                } else {
                  if (res.errorCode) {
                    $state.go('error.userAccessRestricted');
                  }
                }
              });
            }],
            'Conversation' : ['Item', 'NegotiationFactory', '$auth', '$q', '$state', 'AdsItemService', 'NegotiationService', '$uibModal', function (Item, NegotiationFactory, $auth, $q, $state,AdsItemService,NegotiationService,$uibModal) {
              var deferred = $q.defer();
              return NegotiationFactory.getLastConversation(Item.data)
                    .then(function(conversation) {
                      if (conversation.hasSeveralConversations) {
                        $state.go('negotiationsList');
                      } else if (!conversation.conversationId && AdsItemService.isSold(Item.data.status) && NegotiationService.isSeller(conversation.role)) {
                        var modalInstance = $uibModal.open({
                          animation: true,
                          templateUrl: 'views/partials/viva-item-sold.html',
                          controller: 'ItemSoldController',
                          size: 'sm',
                          windowClass: 'item-sold'
                        });
                        return deferred.reject({});
                      } else {
                        if (!conversation.conversationId && $auth.getPayload().username === Item.data.user.username) {
                          return deferred.reject({});
                        } else {
                          return conversation;
                        }
                      }
                    });
            }],
            'Chats': ['NegotiationFactory', 'Conversation', function (NegotiationFactory, Conversation) {
              if (Conversation.conversationId) {
                return NegotiationFactory.getHashChats(Conversation);
              }
              return {};
            }]
          }
        })
      .state('negotiation',
        {
          url: '/negotiation/:idNegotiation',
          templateUrl: 'views/viva-chat-negotiation.html',
          controller: 'NegotiationController',
          resolve: {
            'isLogged' : ['$auth', '$state', '$q', function($auth, $state, $q) {
              var deferred = $q.defer();
              deferred.resolve($auth.isAuthenticated());
              return deferred.promise.then(function(flag) {
                if (!flag) {
                  $state.go('error.userAccessRestricted');
                }
              });
            }],
            'Conversation': ['NegotiationService', '$stateParams', '$state', function(NegotiationService, $stateParams,$state) {
              return NegotiationService.getConversation($stateParams.idNegotiation)
                    .then(function (resp) {
                        return resp;
                    })
                    .catch(function(error) {
                      if (error.errorCode === 703) {
                          $state.go('error.productNotFound');
                        }
                    });
            }],
            'Chats': ['NegotiationFactory', 'Conversation', function(NegotiationFactory, Conversation) {
              return NegotiationFactory.getHashChats(Conversation);
            }],
            'Item': ['AdsItemService', 'Conversation', function (AdsItemService, Conversation) {
              return AdsItemService.find(Conversation.itemId);
            }]
          }
        });
  }

  angular.module('vivaApp')
  .config(NegotiationAppRoutes);

}());

(function() {
  'use strict';

  AppRoutes.$inject = ['$provide', '$urlRouterProvider', '$locationProvider'];
  function AppRoutes ($provide, $urlRouterProvider, $locationProvider) {
    'ngInject';

    decorator.$inject = ['$delegate'];
    OtherwiseUrlRoutes.$inject = ['$injector', '$location'];
    $urlRouterProvider.otherwise(OtherwiseUrlRoutes);

    $locationProvider.html5Mode(true);

    $provide.decorator('$uiViewScroll', decorator);

    function decorator ($delegate) {
      'ngInject';
      return function (uiViewElement) {
        var top = uiViewElement[0].getBoundingClientRect().top;
        window.scrollTo(0, (top - 1000));
      };
    }

    function OtherwiseUrlRoutes ($injector, $location){
      'ngInject';
      var state = $injector.get('$state');
      state.go('404');
      return $location.path();
    }

  }

  angular.module('vivaApp')
  .config(AppRoutes);

}());

(function() {
  'use strict';

  ItemAppRoutes.$inject = ['$stateProvider'];
  function ItemAppRoutes ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('item',
        {
          url: '/pr/:itemCategory/:itemName/:itemId',
          templateUrl: 'views/item-detail.html',
          controller: 'ItemDetailController',
          ncyBreadcrumb: {
            label: '{{category|capitalize}}'
          }
        })
      .state('itemAndDescription',
        {
          url: '/:itemDescription/items/:itemId',
          templateUrl: 'views/item-detail.html',
          controller: 'ItemDetailController',
          ncyBreadcrumb: {
            label: '{{category|capitalize}}'
          }
        });
  }

  angular.module('vivaApp')
  .config(ItemAppRoutes);

}());

(function() {
  'use strict';

  HomeAppRoutes.$inject = ['$stateProvider'];
  function HomeAppRoutes ($stateProvider) {
    'ngInject';

    rootController.$inject = ['$state'];
    homeController.$inject = ['$state', 'LocationService', '$cookies'];
    $stateProvider
      .state('root',
        {
          url: '/',
          template: '<ui-view>',
          controller: rootController
        })
      .state('home',
        {
          url: '/home',
          template: '<ui-view>',
          controller: homeController
        })
      .state('homeNoLocation',
        {
          url: '/home/',
          template: '<ui-view>',
          controller: rootController
        })
      .state('homeLocation',
        {
          url: "/home/{locationId:[a-zA-Z\-]{1,}\-[a-zA-Z\-]{1,}}",
          templateUrl: 'views/home.html',
          controller: 'HomeController',
          reloadOnSearch: false
        });

    function rootController ($state) {
      'ngInject';
      $state.go('home');
    }

    function homeController ($state, LocationService, $cookies) {
      'ngInject';
      LocationService.getUserPosition()
        .then(function (coors) {
          LocationService.getCityByLatLng(coors.latitude, coors.longitude)
            .then(function (city) {
              $cookies.put('user-location', city.id);
              $state.go('homeLocation', {
                locationId: city.id
              });
            })
            .catch(function (err) {
              $cookies.put('user-location', 'houston-tx');
              $state.go('homeLocation', {
                locationId: 'houston-tx'
              });
            })
        })
        .catch(function (err) {
          $cookies.put('user-location', 'houston-tx');
          $state.go('homeLocation', {
            locationId: 'houston-tx'
          });
        });
    }
  }

  angular.module('vivaApp')
  .config(HomeAppRoutes);

}());

(function() {
  'use strict';

  ErrorAppRoutes.$inject = ['$stateProvider'];
  function ErrorAppRoutes ($stateProvider) {
    'ngInject';

      notFoundController.$inject = ['$rootScope', 'UtilsService', '$scope'];
    $stateProvider
      .state('error',
        {
          abstract: true,
          url: '/error',
          template: '<ui-view>'
        })
      .state('error.productNotFound',
        {
          url: '/productNotFound',
          templateUrl: 'views/error/product-not-found.html',
          controller: notFoundController
        })
      .state('error.groupNotFound',
        {
          url: '/groupNotFound',
          templateUrl: 'views/error/group-not-found.html',
          controller: notFoundController
        })
      .state('error.profileNotFound',
        {
          url: '/profileNotFound',
          templateUrl: 'views/error/profile-not-found.html',
          controller: notFoundController
        })
      .state('error.userNotAuthorized',
        {
          url: '/userNotAuthorized',
          templateUrl: 'views/error/user-not-authorized.html',
          controller: notFoundController
        })
      .state('error.userAccessRestricted',
      {
        url: '/userAccessRestricted',
        templateUrl: 'views/error/user-access-restricted.html',
        controller: notFoundController
      })
      .state('404', {
        templateUrl: 'views/404-page.html'
      });

      function notFoundController ($rootScope, UtilsService, $scope) {
        'ngInject';
        $rootScope.$emit('newMetaData', UtilsService.newMetadata($scope.metadata, {
          'title': 'Vivanuncios Estados Unidos',
          'description': '',
          'robots': 'follow, noindex'
        }));
      };
  }

  angular.module('vivaApp')
  .config(ErrorAppRoutes);

}());

(function() {
  'use strict';

  UtilsService.$inject = ['$state'];
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


(function() {
  'use strict';

  UserService.$inject = ['$q', '$http', '$rootScope', 'QueryApiService'];
  function UserService ($q, $http, $rootScope, QueryApiService) {
    'ngInject';

    return {
      find: function (id) {
        return QueryApiService.makeRequest({
          method: 'GET',
          url: '/api/public/users/v3/' + username + '/info'
        })
      },
      getByUsername: function (username) {
        return QueryApiService.makeRequest({
          method: 'GET',
          url: '/api/public/users/v3/' + username + '/info'
        })
      },
      signOut: function () {
        return QueryApiService.makeRequest({
          method: 'POST',
          url: '/api/users/v3/signout'
        })
      },
      getRates: function (username, rateType) {
        return QueryApiService.makeRequest({
          method: 'GET',
          url: '/api/public/users/v3/' + username + '/rates',
          params: {
            rate: rateType
          }
        })
      },
      listRates: function (parameters) {
        return QueryApiService.makeRequest({
          method: 'GET',
          url: '/api/public/ratings/v3',
          params: parameters
        })
      },
      unFollowUser: function (username, userToUnFollow) {
        return QueryApiService.makeRequest({
          method: 'PUT',
          url: '/api/users/v3/' + username + '/unfollow',
          data: {userToUnfollow: userToUnFollow}
        })
      },
      followUser: function (username, userToFollow) {
        return QueryApiService.makeRequest({
          method: 'PUT',
          url: '/api/users/v3/' + username + '/follow',
          data: {userToFollow: userToFollow}
        })
      },
      getFollowers: function (username, isAuthenticate) {
        var url = isAuthenticate ?
          '/api/users/v3/' + username + '/followers':
          '/api/public/users/v3/' + username + '/followers' ;
        return QueryApiService.makeRequest({
          method: 'GET',
          url: url
        })
      },
      getFollowings: function (username, isAuthenticate) {
        var url = isAuthenticate ?
        '/api/users/v3/' + username + '/follow':
        '/api/public/users/v3/' + username + '/follow' ;
        return QueryApiService.makeRequest({
          method: 'GET',
          url: url
        })
      },
      updateProfile: function (username, parameters) {
        return QueryApiService.makeRequest({
          method: 'PUT',
          url: '/api/users/v3/' + username + '/info',
          data: parameters
        })
      },
      verifyEmail: function () {
        return QueryApiService.makeRequest({
          method: 'POST',
          url: 'api/users/v3/sendverification'
        })
      }
    };
  }

  angular.module('app.services')
  .service('UserService', UserService);

}());


(function() {
  'use strict';

  SendPassLinkService.$inject = ['$http'];
  function SendPassLinkService ($http) {
    'ngInject';

    this.sendResetPasswordLink = function(email) {

      var resetPasswordApi = '/api/password-reset/email';

      var emailJson = {"email":email};

      $http.defaults.useXDomain = true;
      return $http({
        method: 'POST',
        url: resetPasswordApi,
        dataType: 'JSON',
        data: emailJson
      }).then(function (results) {
        return results.data;
      }, function errorCallback(response) {
        return {error: 'Api unavailable'};
      });
    };

    this.resetPasswordAPI = function(id, newPass) {

      var uri = 'api/password-reset/email/' + id;
      $http.defaults.useXDomain = true;
      return $http({
        method: 'POST',
        data: {'password': newPass},
        dataType: 'JSON',
        url: uri
      }).then(function (results) {
        return results.data
      },
      function errorCallback(response) {
        return {error: 'Api unavailable'};
      });
    };
  }

  angular.module('app.services')
  .service('SendPassLinkService', SendPassLinkService);
}());


(function() {
  'use strict';

  SearchModelFactory.$inject = ['LocationService', '$q', '$cookies'];
  function SearchModelFactory (LocationService, $q, $cookies) {
    'ngInject';

    var serviceInstance = {
      location: {},
      isInitialized: false

    };

    var model = {
      //This property is static
      defaultLocation: {
        id:'',
        name: appConfig.wholeCountryParams.name,
        state: '',
        latitude: 0,
        longitude: 0,
        userCoords: false
      },
      //This property is dynamic
      location: {
        id:'',
        name: '',
        state: '',
        latitude: 0,
        longitude: 0,
        userCoords: false
      }
    };

    var getIdLocation = function (city, state) {
      return (city.replace(/ /gi, '_') + '-' + state.replace(/ /gi, '_')).toLowerCase();
    };

    var updateId = function() {
      var id =  (model.location.name =='') ? model.defaultLocation.name : getIdLocation(model.location.name, model.location.state);
      model.location.id = id;
    };

    //readonly
    Object.defineProperty(serviceInstance.location, 'id', {
      get: function() {
          if (model.location.id == ''){
            updateId();
          }
          return model.location.id;
      }
    });

    Object.defineProperty(serviceInstance.location, 'name', {
      get: function() {
          return model.location.name;
      },
      set: function(name) {
          model.location.name = name;
          updateId();
      }
    });

    Object.defineProperty(serviceInstance.location, 'state', {
      get: function() {
          return model.location.state;
      },
      set: function(state) {
          model.location.state = state;
          updateId();
      }
    });

    Object.defineProperty(serviceInstance.location, 'latitude', {
      get: function() {
          return model.location.latitude;
      },
      set: function(latitude) {
          model.location.latitude = latitude;
          model.userCoords = true;
      }
    });

    Object.defineProperty(serviceInstance.location, 'longitude', {
      get: function() {
          return model.location.longitude;
      },
      set: function(longitude) {
          model.location.longitude = longitude;
          model.userCoords = true;
      }
    });

    Object.defineProperty(serviceInstance.location, 'userCoords', {
      get: function() {
          return model.location.userCoords;
      }
    });

    serviceInstance.isDefaultLocation = function() {
      return ((model.location.name =='' ) || (model.defaultLocation.name == model.location.name));
    };

    serviceInstance.getLocationId = function() {
      var id = (model.location.name =='') ? model.defaultLocation.name : getIdLocation(model.location.name, model.location.state);
      return id;
    };


    serviceInstance.getLocation = function(isWholeUsa) {
      if (typeof isWholeUsa !== 'undefined'){
        return (isWholeUsa) ? model.defaultLocation : model.location;
      }
      return model.location;
    }

    serviceInstance.reset = function() {
      model.location.id = '';
      model.location.name = '';
      model.location.state = '';
      model.location.latitude = 0;
      model.location.longitude = 0;
      model.location.userCoords = false;
      this.isInitialized = true;
    };


    serviceInstance.isLocationSynchronized = function(locationId) {
      if ((locationId) && (locationId == model.location.id)) {
        return true;
      }
      return false;
    }


    serviceInstance.synchronizeLocation = function(locationId) {
      var deferred = $q.defer();
      serviceInstance.isInitialized = true;

      var getCityPromise = LocationService.getCityById(locationId).then( function( city ){
        model.location.id = city.id;
        model.location.name = city.name;
        model.location.state = city.state;
        model.location.latitude = city.latitude;
        model.location.longitude = city.longitude;
      });
      deferred.resolve(getCityPromise);
      return deferred.promise;
    };

    serviceInstance.updateBreadcrumb = function(scope, term, isWholeUsa) {

      console.log(model.defaultLocation.name);
      angular.extend(scope, {
        brCrumb: {
          term: (isWholeUsa)? term  + ' in ' + model.defaultLocation.name : term,
          location: (isWholeUsa)? model.defaultLocation.name :  (model.location.name + ', ' +  model.location.state)
        }
      });

    };

    serviceInstance.updateLocationCoookie = function() {
      $cookies.put('location',model.location.id);
    }

    return serviceInstance;
  }

  angular.module('app.services')
  .factory('SearchModelFactory', SearchModelFactory);

}());


(function() {
  'use strict';

  RecoverPasswordService.$inject = ['QueryApiService'];
  function RecoverPasswordService (QueryApiService) {
    'ngInject';

    return {
      recoverPassword: function (email){
        return QueryApiService.makeRequest({
          method: 'POST',
          url: '/api/users/v3/forgotpwd',
          data: email
        })
      }
    };
  }

  angular.module('app.services')
  .service('RecoverPasswordService', RecoverPasswordService);
}());


/**
 * Created by neto on 15/03/16.
 */
(function() {
  'use strict';

  QueryApiService.$inject = ['$http'];
  function QueryApiService ($http) {
    'ngInject';

    return {
      makeRequest: function (options) {
        if (!options.data && !options.params) {
          options.data = {}
        }
        if (!options.headers) {
          options.headers = {
            "Content-Type": "application/json"
          }
        }
        options.headers['Accept-Language'] = 'es';
        return $http(options)
          .then(function (data) {
            return data.data;
          })
      }
    }
  }

  angular.module('app.services')
  .service('QueryApiService', QueryApiService);
}());


(function() {
  'use strict';

  NegotiationService.$inject = ['QueryApiService', 'DateHandler', '$q'];
  function NegotiationService (QueryApiService, DateHandler, $q) {
    'ngInject';

    var ROLE_BUYER = "buyer";
    var ROLE_SELLER = "seller";
    var ACTION_OFFER = "OFFER";
    var STATUS_OPEN_NEGOTIATION = "OPEN";
    var STATUS_REJECTED_NEGOTIATION = "CANCELLED";
    var STATUS_ACCEPTED_NEGOTITATION = "ACCEPTED";

    var negotiationService = {};

    negotiationService.getConversation = getConversation;
    negotiationService.getConversationByItem = getConversationByItem;
    negotiationService.getConversations = getConversations;
    negotiationService.sendChat = sendChat;
    negotiationService.sendOffer = sendOffer;
    negotiationService.isBuyer = isBuyer;
    negotiationService.isSeller = isSeller;
    negotiationService.isOffer = isOffer;
    negotiationService.acceptOffer = acceptOffer;
    negotiationService.rejectOffer = rejectOffer;
    negotiationService.isAccepted = isAccepted;
    negotiationService.isRejected = isRejected;
    negotiationService.isOpen = isOpen;

    function getConversation (coversationId) {
      var deferred = $q.defer();
      return QueryApiService.makeRequest({
          method: 'GET',
          url: '/api/conversations/v4/' + coversationId,
          params: {
            lastRequest: Date.now()
          }
        })
        .then(function(resp) {
          if (resp.statusCode === 1) {
            return resp.data;
          } else {
            return $q.reject(resp);
          }
        });
    }

    function getConversationByItem (itemId, params) {
      var deferred = $q.defer();
      return QueryApiService.makeRequest({
          method: 'GET',
          url: '/api/conversations/v3/item/' + itemId,
          params: params
        })
        .then(function(resp) {
          if (resp.statusCode === 1) {
            return resp.data;
          } else {
            return $q.reject(resp);
          }
        });
    }

    function getConversations (params) {
      var deferred = $q.defer();
      return QueryApiService.makeRequest({
          method: 'GET',
          url: '/api/conversations/v3.0',
          params: params
        })
        .then(function(resp) {
          if (resp.statusCode === 1) {
            return resp.data;
          } else {
            return $q.reject(resp);
          }
        });
    }

    // function getConversations (params) {
    //   var deferred = $q.defer();
    //   return QueryApiService.makeRequest({
    //       method: 'GET',
    //       url: '/api/conversations/v3.0',
    //       params: params
    //     })
    //     .then(function(resp) {
    //       if (resp.statusCode === 1) {
    //         return resp.data;
    //       } else {
    //         return $q.reject(resp);
    //       }
    //     });
    // }

    function sendChat (data) {
      var deferred = $q.defer();
      return QueryApiService.makeRequest({
          method: 'POST',
          url: '/api/conversations/v3/sendChat',
          data: data
        })
      .then(function(response) {
        if (response.statusCode === 1) {
          return response.data;
        } else {
          return $q.reject(response);
        }
      });
    }

    function sendOffer (data) {
      var deferred = $q.defer();
      return QueryApiService.makeRequest({
        method: 'POST',
        url : '/api/conversations/v3/sendOffer',
        data: data
      }).then(function(response) {
        if (response.statusCode === 1) {
          return response.data;
        } else {
          return $q.reject(response);
        }
      });
    }

    function acceptOffer (data) {
      var deferred = $q.defer();
      return QueryApiService.makeRequest({
        method: 'POST',
        url : '/api/conversations/v3/accept',
        data: data
      }).then(function(response) {
        if (response.statusCode === 1) {
          return response.data;
        } else {
          return $q.reject(response);
        }
      });
    }

    function rejectOffer (data) {
      var deferred = $q.defer();
      return QueryApiService.makeRequest({
        method: 'POST',
        url : '/api/conversations/v3/reject',
        data: data
      }).then(function(response) {
        if (response.statusCode === 1) {
          return response.data;
        } else {
          return $q.reject(response);
        }
      });
    }

    function isBuyer (role) {
      return role === ROLE_BUYER;
    }

    function isSeller (role) {
      return role === ROLE_SELLER;
    }

    function isOffer (action) {
      return action === ACTION_OFFER;
    }

    function isAccepted(status) {
      return status === STATUS_ACCEPTED_NEGOTITATION;
    }

    function isRejected (status) {
      return status === STATUS_REJECTED_NEGOTIATION;
    }

    function isOpen (status) {
      return status === STATUS_OPEN_NEGOTIATION;
    }

    return negotiationService;
  }

  angular.module('app.services')
  .service('NegotiationService', NegotiationService);

}());

(function() {
  'use strict';

  NegotiationFactory.$inject = ['NegotiationService', '$auth', '$timeout', '$cookies', 'DateHandler', '$q', '$rootScope'];
  function NegotiationFactory (NegotiationService, $auth, $timeout, $cookies, DateHandler, $q, $rootScope) {
    'ngInject';

    var ROLE_BUYER = "buyer";
    var ROLE_SELLER = "seller";
    var ACTION_OFFER = "OFFER";
    var STATUS_OPEN_NEGOTIATION = "OPEN";
    var STATUS_REJECTED_NEGOTIATION = "CANCELLED";
    var STATUS_ACCEPTED_NEGOTITATION = "ACCEPTED";
    var COOKIE_LAST_REQUEST_OFFER_BUYER = "VIVA_LAST_REQUEST_OFFERS_BUYER";
    var COOKIE_LAST_REQUEST_OFFER_SELLER = "VIVA_LAST_REQUEST_OFFERS_SELLER";

    var EVENT_RECOUNT_BUYER_OFFERS = 'NegotiationFactory.RecountBuyerOffers';
    var EVENT_RECOUNT_SELLER_OFFERS = 'NegotiationFactory.RecountSellerOffers';

    var getOffersBuyerServiceListener = null;
    var getOffersSellerServiceListener = null;
    var blockServices = false;
    var finishServiceOffersBuyer = false;
    var finishServiceOffersSeller = false;
    var lastRequestOfferBuyer = $cookies.get(COOKIE_LAST_REQUEST_OFFER_BUYER);
    var lastRequestOfferSeller = $cookies.get(COOKIE_LAST_REQUEST_OFFER_SELLER);
    var serviceRunning = false;

    var service = this;

    service.listConversations = {};
    service.listConversations.offersBuyerHash = {};
    service.listConversations.offersSellerHash = {};
    service.listConversations.offersBuyerArray = [];
    service.listConversations.offersSellerArray = [];
    service.listConversations.offersBuyer = null;
    service.listConversations.offersSeller = null;
    service.listConversations.countOffersBuyer = 0;
    service.listConversations.countOffersSeller = 0;

    service.eventRecountBuyerOffers = EVENT_RECOUNT_BUYER_OFFERS;
    service.eventRecountSellerOffers = EVENT_RECOUNT_SELLER_OFFERS;

    service.getHashChats = getHashChats;
    service.getLastConversation = getLastConversation;
    service.getListItemConversations = getListItemConversations;
    service.getOffersBuyer = getOffersBuyer;
    service.getOffersSeller = getOffersSeller;
    service.startServiceListOffers = startServiceListOffers;
    service.stopServiceListOffers = stopServiceListOffers;
    service.isServiceRunning = isServiceRunning;
    service.getListConversations = getListConversations;
    service.seenNewChatsSeller = seenNewChatsSeller;
    service.seenNewChatsBuyer = seenNewChatsBuyer;

    function getHashChats (Conversation, callback) {
      var chats = {};
      Conversation.chats.forEach(function (chat, index) {
        var chatObj = {};
        if (chat.senderUsername.toLowerCase() === Conversation.username.toLowerCase()) {
          chatObj.isMyMessage = false;
          if (NegotiationService.isBuyer(Conversation.role)) {
            chatObj.thumbnail = Conversation.buyerThumbnail;
          } else {
            chatObj.thumbnail = Conversation.sellerThumbnail;
          }
          if (!chatObj.thumbnail) {
            chatObj.thumbnail = '../../../images/vivanuncios/avatar_ph_image_4.svg';
          }
        } else {
          chatObj.isMyMessage = true;
        }
        chatObj.username = chat.senderUsername;
        chatObj.postTime = chat.postTime;
        chatObj.comment = chat.comment;
        chatObj.action = chat.action;
        chatObj.offeredPrice = chat.offeredPrice;
        chatObj.hint = chat.hint;
        chats[chat.chatId] = chatObj;
        if (callback) {
          callback(chat, chatObj);
        }
      });
      return chats;
     }

    function getLastConversation (item, page, pageSize) {
      var user = $auth.getPayload().username.toLowerCase();

      return NegotiationService.getConversationByItem(item.id, {
        pageNumber: page || 0,
        pageSize: pageSize || 20,
        lastRequest: Date.now(),
        role: ""
       }).then(function (resp) {
        var foundedConversation = undefined;
        if (resp.conversations.length === 1) {
          foundedConversation = resp.conversations[0];
        }
        if (resp.conversations.length > 1) {
          foundedConversation = {};
          foundedConversation.hasSeveralConversations = true;
        }
        return foundedConversation || {};
       })
       .catch(function(error) {
        if (error.errorCode === 1407) {
          return {};
        }
       });
     }

    function getListItemConversations (itemId) {
      return NegotiationService.getConversationByItem(itemId, {
        pageNumber: 0,
        pageSize:  24,
        lastRequest: new Date().getTime(),
        role: ''
       }).then(function (resp) {
        return resp.conversations;
       })
       .catch(function(error) {
        if (error.errorCode === 1407) {
          return {};
        }
       });
    }

    function getOffersBuyer (options, repeat) {
      lastRequestOfferBuyer = $cookies.get(COOKIE_LAST_REQUEST_OFFER_BUYER);
      finishServiceOffersBuyer = false;
      return getListOffersBuyer(options, lastRequestOfferBuyer)
      .then(function(listOffersBuyer) {
        // service.listConversations.offersBuyerArray = service.listConversations.offersBuyerArray.concat(listOffersBuyer.offersBuyerArray);
        service.listConversations.offersBuyerHash = angular.merge(service.listConversations.offersBuyerHash, listOffersBuyer.offersBuyerHash);
        if (listOffersBuyer.hasMoreResults && repeat) {
          options.page++;
          return getOffersBuyer({page: options.page, pageSize: 24, count: options.count}, repeat);
        }
        service.listConversations.countOffersBuyer = listOffersBuyer.countOffersBuyer;
        // service.listConversations.offersBuyerHash = angular.merge({}, listOffersBuyer.offersBuyerHash);

        $rootScope.$broadcast(EVENT_RECOUNT_BUYER_OFFERS, listOffersBuyer.countOffersBuyer, service.listConversations.countOffersSeller);
        return listOffersBuyer;
      });
    }

    function getListOffersBuyer(options, lastRequest) {
      return NegotiationService.getConversations({
        page: options.page || 0,
        pageSize: options.pageSize || 24,
        lastRequest: DateHandler.stringDateToEpoc(new Date()) || lastRequest,
        role: ROLE_BUYER
      }).then(function(res) {
        var listOffersBuyer = {};
        listOffersBuyer.offersBuyerHash = {};
        listOffersBuyer.countOffersBuyer = 0;
        listOffersBuyer.offersBuyerArray = res.conversations;
        res.conversations.forEach(function (val, index) {
          listOffersBuyer.offersBuyerHash[val.conversationId] = val;
          options.count++;
          if (val.newChats) {
            listOffersBuyer.countOffersBuyer++;
          }
        });
        listOffersBuyer.totalResults = res.totalResults;
        listOffersBuyer.hasMoreResults = options.count < res.totalResults;
        return listOffersBuyer
      });
    }

    function getOffersSeller (options, repeat) {
      finishServiceOffersSeller = false;
      lastRequestOfferSeller = $cookies.get(COOKIE_LAST_REQUEST_OFFER_SELLER);
      return getListOffersSeller(options, lastRequestOfferSeller)
      .then(function(listOffersSeller) {
        // service.listConversations.offersSellerArray = service.listConversations.offersSellerArray.concat(listOffersSeller.offersSellerArray);
        service.listConversations.offersSellerHash = angular.merge(service.listConversations.offersSellerHash,listOffersSeller.offersSellerHash);
        if (listOffersSeller.hasMoreResults && repeat) {
          options.page++;
          return getOffersSeller({page: options.page, pageSize: 24, count: options.count}, repeat);
        }
        service.listConversations.countOffersSeller = listOffersSeller.countOffersSeller;
        // service.listConversations.offersSellerHash = angular.merge({},listOffersSeller.offersSellerHash);

        $rootScope.$broadcast(EVENT_RECOUNT_SELLER_OFFERS, listOffersSeller.countOffersSeller, service.listConversations.countOffersBuyer);
        return listOffersSeller;
      });
    }

    function getListOffersSeller(options, lastRequest) {
      return NegotiationService.getConversations({
        page: options.page || 0,
        pageSize: options.pageSize || 24,
        lastRequest: DateHandler.stringDateToEpoc(new Date()) || lastRequest,
        role: ROLE_SELLER
      })
      .then(function(res) {
        var listOffersSeller = {};
        listOffersSeller.offersSellerHash = {};
        listOffersSeller.countOffersSeller = 0;
        listOffersSeller.offersSellerArray = res.conversations;
        res.conversations.forEach(function (val, index) {
          listOffersSeller.offersSellerHash[val.conversationId] = val;
          options.count++;
          if (val.newChats) {
            listOffersSeller.countOffersSeller++;
          }
        });
        listOffersSeller.totalResults = res.totalResults;
        listOffersSeller.hasMoreResults = options.count < res.totalResults;
        return listOffersSeller;
      });
    }

    function getListConversations () {
      var getListConversationsDeferred = $q.defer();
      if (isServiceRunning()) {
        getListConversationsDeferred.resolve(service.listConversations);
      } else {
        $timeout(waitForService(function() {
          getListConversationsDeferred.resolve(service.listConversations);
        }), 10000);
      }

      return getListConversationsDeferred.promise;
    }

    function waitForService (callback) {
      return function () {
        if (!isServiceRunning()) {
          $timeout(waitForService(callback), 10000);
        } else if (callback) {
          callback();
        }
      }
    }

    function startServiceListOffers () {
      var promiseServiceStarted = $q.defer();
      var promiseListOffersBuyerCompleted = false;
      var promiseListOffersSellerCompleted = false;
      if (!lastRequestOfferBuyer || !lastRequestOfferSeller) {
        $cookies.put(COOKIE_LAST_REQUEST_OFFER_BUYER, DateHandler.stringDateToEpoc(new Date()));
        $cookies.put(COOKIE_LAST_REQUEST_OFFER_SELLER, DateHandler.stringDateToEpoc(new Date()));
      }
      getOffersBuyer({page: 0, pageSize: 24, count: 0}, true)
      .then (function() {
        finishServiceOffersBuyer = true;
        promiseListOffersBuyerCompleted = true;
        if (promiseListOffersBuyerCompleted && promiseListOffersSellerCompleted) {
          serviceRunning = true;
          promiseServiceStarted.resolve(serviceRunning);
        }
      });
      getOffersSeller({page: 0, pageSize: 24, count: 0}, true)
      .then(function() {
        finishServiceOffersSeller = true;
        promiseListOffersSellerCompleted = true;
        if (promiseListOffersBuyerCompleted && promiseListOffersSellerCompleted) {
          serviceRunning = true;
          promiseServiceStarted.resolve(serviceRunning);
        }
      });
      return promiseServiceStarted.promise
      .then(function() {
        getOffersSellerServiceListener = $timeout(callGetOffersSeller,10000);
        getOffersBuyerServiceListener = $timeout(callGetOffersBuyer,10000);
        return service;
      });
    }

    function stopServiceListOffers () {
      if ($timeout.cancel(getOffersBuyerServiceListener)) {
        blockServices = true;
      }
      if ($timeout.cancel(getOffersSellerServiceListener)) {
        blockServices = true;
      }
      serviceRunning = false;
      service.listConversations.offersBuyerHash = {};
      service.listConversations.offersSellerHash = {};
      service.listConversations.offersBuyer = null;
      service.listConversations.offersSeller = null;
      service.listConversations.countOffersBuyer = 0;
      service.listConversations.countOffersSeller = 0;
    }

    function isServiceRunning () {
      return serviceRunning;
    }

    function seenNewChatsBuyer (time) {
      $cookies.put(COOKIE_LAST_REQUEST_OFFER_BUYER, time);
    }

    function seenNewChatsSeller (time) {
      $cookies.put(COOKIE_LAST_REQUEST_OFFER_SELLER, time);
    }

    function callGetOffersSeller () {
      if (!blockServices) {
        getOffersSeller({page: 0, pageSize: 24, count: 0}, true)
        .then(function() {
          getOffersSellerServiceListener = $timeout(callGetOffersSeller,10000);
        });
      }
    }

    function callGetOffersBuyer () {
      if (!blockServices) {
        getOffersBuyer({page: 0, pageSize: 24, count: 0}, true)
        .then(function() {
          getOffersBuyerServiceListener = $timeout(callGetOffersBuyer,10000);
        });
      }
    }

  }

  angular.module('app.services')
  .service('NegotiationFactory', NegotiationFactory);
}());

(function() {
  'use strict';

  LocationService.$inject = ['$q', '$http', 'UtilsService', 'QueryApiService'];
  function LocationService ($q, $http, UtilsService, QueryApiService) {
    'ngInject';

    var queued = [],
      dp = {},
      currentLocation = {
        id: '',
        name: ''
      },
      apiToken = appConfig.mapboxApiToken,
      statesCodes = [
        {name: 'Alabama', code: 'AL'},
        {name: 'Alaska', code: 'AK'},
        {name: 'Arizona', code: 'AZ'},
        {name: 'Arkansas', code: 'AR'},
        {name: 'California', code: 'CA'},
        {name: 'Colorado', code: 'CO'},
        {name: 'Connecticut', code: 'CT'},
        {name: 'Delaware', code: 'DE'},
        {name: 'District of Columbia', code: 'DC'},
        {name: 'Florida', code: 'FL'},
        {name: 'Georgia', code: 'GA'},
        {name: 'Hawaii', code: 'HI'},
        {name: 'Idaho', code: 'ID'},
        {name: 'Illinois', code: 'IL'},
        {name: 'Indiana', code: 'IN'},
        {name: 'Iowa', code: 'IA'},
        {name: 'Kansas', code: 'KS'},
        {name: 'Kentucky', code: 'KY'},
        {name: 'Louisiana', code: 'LA'},
        {name: 'Maine', code: 'ME'},
        {name: 'Maryland', code: 'MD'},
        {name: 'Massachusetts', code: 'MA'},
        {name: 'Michigan', code: 'MI'},
        {name: 'Minnesota', code: 'MN'},
        {name: 'Mississippi', code: 'MS'},
        {name: 'Missouri', code: 'MO'},
        {name: 'Montana', code: 'MT'},
        {name: 'Nebraska', code: 'NE'},
        {name: 'Nevada', code: 'NV'},
        {name: 'New Hampshire', code: 'NH'},
        {name: 'New Jersey', code: 'NJ'},
        {name: 'New Mexico', code: 'NM'},
        {name: 'New York', code: 'NY'},
        {name: 'North Carolina', code: 'NC'},
        {name: 'North Dakota', code: 'ND'},
        {name: 'Ohio', code: 'OH'},
        {name: 'Oklahoma', code: 'OK'},
        {name: 'Oregon', code: 'OR'},
        {name: 'Pennsylvania', code: 'PA'},
        {name: 'Rhode Island', code: 'RI'},
        {name: 'South Carolina', code: 'SC'},
        {name: 'South Dakota', code: 'SD'},
        {name: 'Tennessee', code: 'TN'},
        {name: 'Texas', code: 'TX'},
        {name: 'Utah', code: 'UT'},
        {name: 'Vermont', code: 'VT'},
        {name: 'Virginia', code: 'VA'},
        {name: 'Washington', code: 'WA'},
        {name: 'West Virginia', code: 'WV'},
        {name: 'Wisconsin', code: 'WI'},
        {name: 'Wyoming', code: 'WY'},
        {name: 'Puerto Rico', code: 'PR'}
      ];

    var mapFeature = function (f) {
      var cl = {
        id_mapbox: f.id,
        latitude: f.center[1],
        longitude: f.center[0],
        name: f.text,
        place_name: f.place_name,
        context: f.context
      };
      if (f.id.startsWith('place')) {
        cl.state = f.context[1].text;
        var stateObject = getStateByName(cl.state);
        var stateCode = stateObject ? stateObject.code : cl.state.replace(/ /gi, '_');
        cl.id = (cl.name.replace(/ /gi, '_') + "-" + stateCode).toLowerCase();
        cl.canonical_name = cl.name + ', ' + stateCode;
      }
      return cl;
    };

    /**
     * This function adds some useful properties to the mapbox response, e.j. the id city_state
     * @param mr The mapbox response
     */
    var mapMapBoxResponse = function (mr) {
      return mr.features.map(mapFeature);
    };


    var getStateByCode = function (code) {
      return _.find(statesCodes, function (state) {
        return state.code === code;
      });
    };

    var getStateByName = function (name) {
      return _.find(statesCodes, function (state) {
        return state.name === name;
      });
    };

    var isWholeUSA = function () {
      return currentLocation.id === '';
    };

    var setCurrentLocation = function (loc) {
      currentLocation = loc;
    };

    var getCurrentLocation = function () {
      return currentLocation;
    };

    /**
     * This function return the city found at lat, lng
     * @param lat Latitude in decimal degrees
     * @param lng Longitude in decimal degrees
     */
    var getCityByLatLng = function (lat, lng) {
      return QueryApiService.makeRequest({
        method: 'GET',
        url: '/api-locations/locations/' + lat + '/' + lng
      });
    };

    var getCityByZipcode = function (zipcode) {
      return QueryApiService.makeRequest({
        method: 'GET',
        url: 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + zipcode + '.json?country=us,pr&types=postcode&access_token=' + apiToken
      });
    };

    /**
     * The main function this search for the city and returns
     * lat, lng, and other information of the city.
     * This uses the localStorage API if available.
     * @param locationId The location id to search in the form city_name-state_name (all spaces should be replace with _)
     * @returns {*|Promise.<T>} A promise that will resolve to the city
     */
    var getCityById = function (locationId) {
      if (UtilsService.isUndefinedOrEmptyString(locationId)) {
        return getLocationUSA();
      }
      if (queued.indexOf(locationId) >= 0) {
        return dp[locationId];
      } else {
        if (UtilsService.isLocalStorageAvailable()) {
          var close5Cities = [];
          if (typeof localStorage.close5Cities3 !== 'undefined') {
            close5Cities = JSON.parse(localStorage.close5Cities3);
            for (var i = 0; i < close5Cities.length; i++) {
              if (close5Cities[i].id === locationId) {
                return $q.when(close5Cities[i]);
              }
            }
            queued.push(locationId);
            var pr = QueryApiService.makeRequest({
              method: 'GET',
              url: '/api-locations/locations/' + locationId
            });
            dp[locationId] = pr;
            pr.then(function (city) {
              localStorage.setItem('close5Cities3', JSON.stringify(close5Cities.concat([city])));
              var io = queued.indexOf(locationId);
              if (io >= 0) {
                queued = queued.splice(io, 1);
                //delete dp[locationId];
              }
            });
            return pr;
          } else {
            var pr = QueryApiService.makeRequest({
              method: 'GET',
              url: '/api-locations/locations/' + locationId
            });
            dp[locationId] = pr;
            pr.then(function (city) {
              localStorage.setItem('close5Cities3', JSON.stringify(close5Cities.concat([city])));
              var io = queued.indexOf(locationId);
              if (io >= 0) {
                queued = queued.splice(io, 1);
                //delete dp[locationId];
              }
            });
            return pr;
          }
        } else {
          return QueryApiService.makeRequest({
            method: 'GET',
            url: '/api-locations/locations/' + locationId
          });
        }

      }
    };

    /**
     * Utility function for getting the lat, lng and other info for the whole country.
     * @returns {Promise} A promise with the USA data
     */
    var getLocationUSA = function () {
      return $q.when({
        "id_mapbox": "country.5877825732302570",
        "name": "United States",
        "canonical_name": "United States",
        "place_name": "United States",
        "state": "",
        "latitude": 36.892576,
        "longitude": -98.994022,
        "context": [{
          "id": "country.5877825732302570",
          "text": "United States", "short_code": "us"
        }],
        "id": "USA"
      });
    };

    /**
     * This method checks for the user's browser location api,
     * if it finds it ask for the user's permissions and look for the location.
     * @returns A promise holding the currentPosition.
     */
    var getUserPosition = function () {
      return $q(function (resolve, reject) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          }, function (err) {
            console.log(err);
            reject({error: "No permission form user."});
          })
        } else {
          reject({error: "Geolocation is not supported by this browser."});
        }
      });

    };

    var getPopularCities = function () {
      return QueryApiService.makeRequest({
        method: 'GET',
        url: '/api-locations/locations/popularCities'
      });
    };

    return {
      isWholeUSA: isWholeUSA,
      setCurrentLocation: setCurrentLocation,
      getCurrentLocation: getCurrentLocation,
      getUserPosition: getUserPosition,
      getLocationUSA: getLocationUSA,
      getCityById: getCityById,
      getPopularCities: getPopularCities,
      getCityByLatLng: getCityByLatLng,
      getCityByZipcode: getCityByZipcode,
      getStateByCode: getStateByCode,
      getCodeState: getStateByName,
      mapFeature: mapFeature
    };
  }

  angular.module('app.services')
  .service('LocationService', LocationService);

}());


(function() {
  'use strict';

  InstanceModal.$inject = ['$uibModal', 'UtilsService', 'SmartBanner'];
  function InstanceModal ($uibModal, UtilsService, SmartBanner) {
    'ngInject';

    var service = {};

    service.loginModal = loginModal;

    function loginModal (options) {
      var modalInstance = $uibModal.open({
        controller: 'LoginFormController',
        templateUrl: 'views/partials/login-form.html',
        windowClass: 'login-form modal full-screen-modal',
        resolve: options.resolve
      });

      modalInstance.rendered
      .then(options.instanceRendered || instanceRendered);

      modalInstance.closed
      .then(options.instanceClosed || instanceClosed);

      function instanceRendered () {
        if (UtilsService.isRunningOnMobile() && SmartBanner.isVisible()) {
          SmartBanner.hideBanner();
        }
      }

      function instanceClosed () {
        if (UtilsService.isRunningOnMobile() && !SmartBanner.isVisible()) {
          SmartBanner.showBanner();
        }
      }
    }

    return service;
  }

  angular.module('app.services')
  .service('InstanceModal', InstanceModal);
}());

(function() {
  'use strict';

  GroupService.$inject = ['$q', '$http', '$auth', '$rootScope', 'QueryApiService'];
  function GroupService ($q, $http, $auth, $rootScope, QueryApiService) {
    'ngInject';

    return {
      find: function (groupId, params) {
        return QueryApiService.makeRequest({
          method: 'GET',
          url: '/' + appConfig.api.namespace + '/groups/' + appConfig.api.version + '/' + groupId,
          params: params
        })
      },
      getItems: function (groupId, params) {
        return QueryApiService.makeRequest({
          method: 'GET',
          url: '/' + appConfig.api.namespace + '/groups/' + appConfig.api.version + '/' + groupId + '/items',
          params: params
        })
      },
      getSubscribers: function (groupId, params) {
        var uri = ''; // group endpoint '/' + appConfig.api.namespace + '/groups/' + appConfig.api.version + '/' + groupId + '/subscribers',
        if ($auth.isAuthenticated()) {
          uri = '/' + appConfig.api.namespace + '/social/v3/' + $auth.getPayload().username + '/search';
        } else {
          uri = '/' + appConfig.api.namespace + '/public/users/v3/search';
        }
        params.groupId = groupId;
        return QueryApiService.makeRequest({
          method: 'GET',
          url: uri,
          params: params
        })
      },
      subscribe: function (groupId) {
        return QueryApiService.makeRequest({
          method: 'POST',
          url: '/' + appConfig.api.namespace + '/groups/' + appConfig.api.version + '/' + groupId + '/subscribe'
        })
      },
      unsubscribe: function (groupId) {
        return QueryApiService.makeRequest({
          method: 'POST',
          url: '/' + appConfig.api.namespace + '/groups/' + appConfig.api.version + '/' + groupId + '/unsubscribe'
        })
      }
    };
  }

  angular.module('app.services')
  .service('GroupService', GroupService);

}());

(function() {
  'use strict';

  FollowUserService.$inject = ['UserService', '$auth', 'InstanceModal'];
  function FollowUserService (UserService, $auth, InstanceModal) {
    'ngInject';

    return {
      toggleFollowUser: function (toggleUsername, followedByUser, callback, rejectCallback) {
        if ($auth.isAuthenticated()) {
          var currentUsername = $auth.getPayload().username;
          var request = followedByUser ?
            UserService.unFollowUser(currentUsername, toggleUsername) :
            UserService.followUser(currentUsername, toggleUsername);
          request.then(function (resp) {
            if (resp.statusCode === 1 && callback) {
              callback();
            } else {
              if (rejectCallback) {
                rejectCallback('reject',resp);
              }
            }
          })
        } else {
          if (rejectCallback) {
            rejectCallback('no-auth');
          }
          InstanceModal.loginModal({
  resolve: {
    DisplayTitleMessage: function () {
      return false;
    }
  }
});
        }
      },
      isFollowed: function (user) {
        return user && user.followedByUser;
      },
      isLoggedUser: function (username) {
        return $auth.isAuthenticated() && ($auth.getPayload().username === username);
      }
    };
  }

  angular.module('app.services')
  .service('FollowUserService', FollowUserService);

}());

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

(function() {
  'use strict';

  ChangePasswordService.$inject = ['QueryApiService'];
  function ChangePasswordService (QueryApiService) {
    'ngInject';

    return {
      changePassword: function (passwords){
        return QueryApiService.makeRequest({
          method: 'POST',
          url: '/api/users/v3/changepwd',
          data: passwords
        })
      }
    };
  }

  angular.module('app.services')
  .service('ChangePasswordService', ChangePasswordService);
}());

(function() {
  'use strict';

  CategoryService.$inject = ['$http', '$q', 'QueryApiService'];
  function CategoryService ($http, $q, QueryApiService) {
    'ngInject';

    var cachedCategories = [];

    var codesToIds = {
      'ropa-moda-accesorios': 19,
      'electronica-venta': 5,
      'autos-usados-venta': 8,
      'ninos-bebes': 13,
      'deportes-hobbies': 6,
      'muebles-usados': 15,
      'electrodomesticos': 9,
      'juegos-peliculas': 20,
      'quinceaneras-fiestas': 1,
      'anuncios-gratis': 10,
      'herramientas': 21
    };

    var idsToCodes = {
      11: '',
      19: 'ropa-moda-accesorios',
      5: 'electronica-venta',
      8: 'autos-usados-venta',
      13: 'ninos-bebes',
      6: 'deportes-hobbies',
      15: 'muebles-usados',
      9: 'electrodomesticos',
      20: 'juegos-peliculas',
      1: 'quinceaneras-fiestas',
      10: 'anuncios-gratis',
      21: 'herramientas'
    };

    var categoryService = {
      idsToCodes: idsToCodes,
      codesToIds: codesToIds,
      find: function (id) {
        return categoryService.all()
          .then(function (catPromise) {
            if (!id) {
              return catPromise.data.categories[0];
            }
            return _.find(catPromise.data.categories, function (category) {
              return category.id === parseInt(id);
            });
          })
      },
      findByCode: function (code) {
        var id = categoryService.codesToIds[code];
        return categoryService.find(id);
      },
      findByName: function (name) {
        categoryService.all()
          .then(function (catPromise) {
            return _.find(catPromise.data.categories, function (category) {
              return category.name === name;
            });
          })
      },
      all: function () {
        if (cachedCategories.length > 0) {
          return $q.when(cachedCategories);
        } else {
          return QueryApiService.makeRequest({
              method: 'GET',
              url: '/api/public/categories/v3'
            })
            .then(function (resp) {
              _.map(resp.data.categories, function (category) {
                category.code = idsToCodes[category.id];
                return category;
              });
              resp.data.categories[0].name = 'Todas';
              cachedCategories = resp;
              return resp;
            });
        }
      },
      seoTags: {
        'Todas': {
          code: 'N/A',
          title: 'Clasificados #location#',
          metaTitle: 'Clasificados Gratis | Anuncios Gratis | Vivanuncios #location#',
          metaKeywords: 'anuncios,clasificados,anuncios gratis, clasificados gratis',
          metaDescription: 'Clasificados Gratis para #location#. Vendé y compra de todo. Carros, Muebles, Ropa, Electrodomésticos, Celulares y mucho más. Vivanuncios #location#',
          metaH1: 'Anuncios Clasificados #location#'
        },
        'Cercanos': {
          code: 'N/A',
          title: 'Clasificados #location#',
          metaTitle: 'Clasificados Gratis | Anuncios Gratis | Vivanuncios #location#',
          metaKeywords: 'anuncios,clasificados,anuncios gratis, clasificados gratis',
          metaDescription: 'Clasificados Gratis para #location#. Vendé y compra de todo. Carros, Muebles, Ropa, Electrodomésticos, Celulares y mucho más. Vivanuncios #location#',
          metaH1: 'Anuncios Clasificados #location#'
        },
        'Home Page': {
          code: 'N/A',
          title: 'Clasificados #location#',
          metaTitle: 'Clasificados Gratis | Anuncios Gratis | Vivanuncios #location#',
          metaKeywords: 'anuncios,clasificados,anuncios gratis, clasificados gratis',
          metaDescription: 'Clasificados Gratis para #location#. Vendé y compra de todo. Carros, Muebles, Ropa, Electrodomésticos, Celulares y mucho más. Vivanuncios #location#',
          metaH1: 'Anuncios Clasificados #location#'
        },
        'Moda y Accesorios': {
          code: 'Ropa-Moda-Accesorios',
          title: 'Ropa y Accesorios #location#',
          metaTitle: 'Ropa en venta, accesorios y moda. Vivanuncios #location#',
          metaKeywords: 'ropa,ropa usada,ropa venta,accesorios moda',
          metaDescription: 'Ropa en venta en #location# Vivanuncios. Accesorios, moda, ropa de marca y mucho más en Vivanuncios #location#.',
          metaH1: 'Ropa y Accesorios en Venta #location#'
        },
        'Electrónica': {
          code: 'electronica-venta',
          title: 'Electrónicos #location#',
          metaTitle: 'Electrónica, Celulares y Computadoras en Venta',
          metaKeywords: 'electrónica,celulares,computadoras,televisores',
          metaDescription: 'Compra y vende celulares usados, computadoras, tablets, televisores, y mucho más en Vivanuncios #location#',
          metaH1: 'Celulares, Laptops, TV Usados #location#'
        },
        'Autos y Motos': {
          code: 'autos-usados-venta',
          title: 'Vehículos Usados #location#',
          metaTitle: 'Autos, Carros, Trocas y Motos Usadas en Vivanuncios #location#',
          metaKeywords: 'autos,carros,vans,trocas,motos,motoras',
          metaDescription: 'Autos y trocas usadas y nuevas en venta en #location#. Ecuentra autos, motos, trocas, usadas y nuevas en Vivanuncios #location#',
          metaH1: 'Vehículos Usados #location#'
        },
        'Niños y Bebés': {
          code: 'ninos-bebes',
          title: 'Bebés y Niños #location#',
          metaTitle: 'Accesorios para bebés y Niños en Vivanuncios #location#',
          metaKeywords: 'accesorios bebés,ropa niños',
          metaDescription: 'Accesorios para bebés y niños en Vivanuncios #location#. Ropa para bebés, venta de juguetes, carreolas nuevas y usadas, y más en Vivanuncios.',
          metaH1: 'Accesorios para Bebés y Niños #location#'
        },
        'Deportes y Ocio': {
          code: 'deportes-hobbies',
          title: 'Deportes y Hobbies #location#',
          metaTitle: 'Deportes y Hobbies en Vivanuncios #location#',
          metaKeywords: 'balones,pelotas,futbol,footbal,baseball',
          metaDescription: 'Bicicletas usadas, juegos de mesa, hobbies en Vivanuncios #location#. Encuentra de todo para el deporte en Vivanuncios',
          metaH1: 'Deportes y Hobbies #location#'
        },
        'Muebles y Hogar': {
          code: 'muebles-usados',
          title: 'Muebles y Hogar #location#',
          metaTitle: 'Muebles usados, decoración y muebles en venta en Vivanuncios #location#',
          metaKeywords: 'muebles,muebles usados,muebles en venta,decoración',
          metaDescription: 'Muebles usados y decoración en Vivanuncios #location#. Oportunidad en muebles usados y decoración para tu hogar en Vivanuncios.',
          metaH1: 'Muebles Usados y Decoración #location#'
        },
        'Electrodomésticos': {
          code: 'electrodomesticos',
          title: 'Electrodomésticos Usados #location#',
          metaTitle: 'Electrodomésticos usados a grandes precios en Vivanuncios #location#',
          metaKeywords: 'electrodomesticos,cafeteras,freidoras,cacharros',
          metaDescription: 'Electrodomésticos usados en venta en Vivanuncios #location#. Encuentra cafeteras, batidoras, parrillas, hornos y más en Vivanuncios.',
          metaH1: 'Electrodomésticos Usados #location#'
        },
        'Juegos y Películas': {
          code: 'juegos-peliculas',
          title: 'Juegos y Películas #location#',
          metaTitle: 'Juegos Usados, Videojuegos  y Películas en Vivanuncios #location#',
          metaKeywords: 'juegos,videojuegos,películas',
          metaDescription: 'Videojuegos usados, películas en venta en Vivanuncios #location#. Grandes ofertas en juegos usados en Vivanuncios.',
          metaH1: 'Videojuegos Usados #location#'
        },
        'Quinceañera y Eventos': {
          code: 'quinceaneras-fiestas',
          title: 'Quinceañeras y Eventos #location#',
          metaTitle: 'Vestidos de quinceañeras y servicios para quinceañeras #location#',
          metaKeywords: 'quinceaneras',
          metaDescription: 'Vestidos de Quinceañeras usados para la venta en Vivanuncios #location#. Eventos para quinceañeras en Vivanuncios.',
          metaH1: 'Vestidos para Quinceañeras #location#'
        },
        'Herramientas': {
          code: 'herramientas',
          title: 'Herramientas en Vivanuncios #location#',
          metaTitle: 'Herramientas en Vivanuncios #location#',
          metaKeywords: 'herramientas',
          metaDescription: 'Herramientas en Vivanuncios #location#. Herramientas en Vivanuncios.',
          metaH1: 'Herramientas #location#'
        },
        'Otros': {
          code: 'anuncios-gratis',
          title: 'De todo en Vivanuncios #location#',
          metaTitle: 'Anuncios clasificados en Vivanuncios #location#',
          metaKeywords: '',
          metaDescription: 'De todo en venta en Vivanuncios #location#. Clasificados de Usados y Seminuevos en Vivanuncios.',
          metaH1: 'Anuncios Gratis #location#'
        }
      }
    };

    return categoryService;
  }

  angular.module('app.services')
  .service('CategoryService', CategoryService);
}());


(function() {
  'use strict';

  SmartBanner.$inject = ['$cookies', '$rootScope', '$compile', '$q', '$timeout'];
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

(function() {
  'use strict';

  BranchIoService.$inject = ['$q', '$translate', '$cookies'];
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


(function() {
  'use strict';

  AdsItemService.$inject = ['QueryApiService', '$http', '$q', '$rootScope', '$auth'];
  function AdsItemService (QueryApiService, $http, $q, $rootScope, $auth) {
    'ngInject';

    var findByUser = function (username, params, itemId) {
      itemId = itemId || '';
      return QueryApiService.makeRequest({
        method: 'GET',
        url: '/api/items/v3/user/' + username + '/' + itemId,
        params: params
      })
    };

    var find = function (id) {
      return QueryApiService.makeRequest({
        method: 'GET',
        url: '/api/public/items/v3/' + id
      })
    };

    var searchPublic = function (params) {
      return QueryApiService.makeRequest({
        method: 'GET',
        url: '/api/public/items/v3/search',
        params: params
      })
    };

    var search = function (params) {
      return QueryApiService.makeRequest({
        method: 'GET',
        url: '/api/items/v3/search',
        params: params
      })
    };

    var toggleLikeItem = function (id, like) {
      return QueryApiService.makeRequest({
        method: like ? 'PUT' : 'DELETE',
        headers: {
          'Content-type': 'application/json'
        },
        url: '/api/items/v3/' + id + '/follow'
      })
    };

    var unLikeItem = function (id, token) {
      return QueryApiService.makeRequest({
        method: 'DELETE',
        headers: {
          'token': token,
          'Content-type': 'application/json'
        },
        url: '/api/items/v3/' + id + '/follow'
      })
    };

    function isSold (status) {
      return status === 'SOLD';
    }

    function sellItem (itemId) {
      var deferred = $q.defer();
      return QueryApiService.makeRequest({
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        url: '/api/items/v3/' + itemId + '/buy'
      }).
      then(function(res) {
        if (res.statusCode === 1) {
          return res.data;
        } else {
          return $q.reject(res);
        }
      });
    }

    return {
      findByUser: findByUser,
      find: find,
      searchPublic: searchPublic,
      search: search,
      toggleLikeItem: toggleLikeItem,
      unLikeItem: unLikeItem,
      isSold: isSold,
      sellItem: sellItem
    };
  }

  angular.module('app.services')
  .service('AdsItemService', AdsItemService);
}());

(function() {
  'use strict';

  VivaCurrency.$inject = ['currencyFilter'];
  function VivaCurrency (currencyFilter) {
    'ngInject';

    return function (input) {
      return  currencyFilter(input, '$', (input % 1 > 0) ? 2 : 0);
    }
  }
  angular.module('app.filters')
  .filter('vivaCurrency', VivaCurrency);

}());

/**
 * Created by neto on 19/11/15.
 */
 (function() {
  'use strict';

  Trusted.$inject = ['$sce'];
  function Trusted ($sce) {
    'ngInject';

    return function(text) {
        return $sce.trustAsHtml(text);
    };
  }

  angular.module('app.filters')
  .filter('trusted', Trusted);

}());


/**
 * Created by neto on 09/12/15.
 */
 (function() {
  'use strict';

  function ItemImage () {
    return function (input, all) {
      return appConfig.imgUrlTemplate  + input + '/image?number=0';
    }
  }

  angular.module('app.filters')
  .filter('itemImage', ItemImage);
 }());

/**
 * Created by neto on 09/12/15.
 */
 (function() {
  'use strict';

  function Capitalize () {
    return function (input, all) {
      var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
      return (!!input) ? input.replace(reg, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }) : '';
    };
  }

  angular.module('app.filters')
  .filter('capitalize', Capitalize);
 }());

(function() {
  'use strict';

  VivaSpinner.$inject = ['$timeout', '$rootScope', 'UtilsService'];
  function VivaSpinner ($timeout, $rootScope, UtilsService) {
    'ngInject';

    return {
      templateUrl: 'views/partials/viva-spinner.html',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        loading: '=?',
        serviceId: '@?'
      },
      link: function postLink(scope, element, attrs) {

        var count = 0;
        var serviceList = [];
        var namePushListener = 'VIVA.spinner.pushLoadingService' + scope.serviceId;
        var namePopListener = 'VIVA.spinner.popLoadingService' + scope.serviceId;

        scope.$on(namePushListener,pushLoadingService);
        scope.$on(namePopListener, popLoadingService);

        function pushLoadingService (ev, service) {
          var idService = generateConsecutive();
          serviceList.push(idService);
          scope.loading = true;
          service.then(function() {
                popLoadingService('',idService);
              }).catch(function() {
                popLoadingService('',idService);
              });
        }

        function popLoadingService (ev, idService) {
          serviceList.splice(serviceList.indexOf(idService), 1);
          if (!serviceList.length) {
            scope.loading = false
          }
        }

        function generateConsecutive () {
          return count++;
        }
      }
    };
  }

  angular.module('app.directives')
  .directive('vivaSpinner', VivaSpinner);

}());


(function() {
  'use strict';

  VivaNegotiationItem.$inject = ['DateHandler', 'NegotiationService', '$state'];
  function VivaNegotiationItem (DateHandler, NegotiationService, $state) {
    'ngInject';

    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      templateUrl: 'views/partials/viva-negotiation-list-item.html',
      scope: {
        offer: '='
      },
      link: function(scope, ele, attr) {

        scope.goToThisConversation = goToThisConversation;

        if (scope.offer.lastChat) {
          scope.date = DateHandler.formattDateToPostTime(parseInt(scope.offer.lastChat.postTime));
        }
        scope.$on('VIVA.negotiationListItems.changeOffer', changeOffer);

        if (NegotiationService.isBuyer(scope.offer.role)) {
          if (scope.offer.buyerThumbnail) {
            scope.userStyle = {
              'background': 'url("'+scope.offer.buyerThumbnail+'") center center / cover'
            };
          }
        } else {
          if (scope.offer.sellerThumbnail) {
            scope.userStyle = {
              'background': 'url("'+scope.offer.sellerThumbnail+'") center center / cover'
            };
          }
        }
        scope.itemStyle = {
          'background': 'url("'+scope.offer.itemPicture+'") center center / cover'
        };

        if (NegotiationService.isRejected(scope.offer.status)) {
          scope.date += ' <span class="text-red"><b>·</b> Negociación cancelada</span>'
        }

        if (NegotiationService.isAccepted(scope.offer.status)) {
          scope.date += ' <span class="text-green"><b>·</b> Oferta aceptada</span>'
        }

        function changeOffer (ev, offer) {
          if (offer.conversationId === scope.offer.conversationId) {
            scope.offer = offer;
          }
        }

        function goToThisConversation () {
          $state.go('negotiation', {
            idNegotiation: scope.offer.conversationId
          });
        }
      }
    };
  }

  angular.module('app.directives')
  .directive('vivaNegotiationItem',VivaNegotiationItem);
}());

(function  () {

  'use strict';

  VivaLoginSignUp.$inject = ['LocationService'];
  function VivaLoginSignUp (LocationService) {
    'ngInject';

    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      templateUrl: 'views/partials/login-form-register.html',
      scope: {
        user: '=',
        registrationForm: '=',
        apiError: '=',
        validZipcode: '=',
        disableInvalidZipCodeMessage: '=',
        isLocationEmpty: '=',
        registrationFormDisplayed: '=',
        signupSubmit: '='
      },
      link: function (scope, element, attr) {

        scope.$watch('registrationForm.zipCode.$valid',
          function(validity) {
            if (validity) {
                LocationService.getCityByZipcode(registrationForm.zipCode.value)
                .then(function (data) {
                  var locationData = data.features[0];
                  if (locationData != undefined) {
                    scope.user.zipcode = registrationForm.zipCode.value;
                    var lat = locationData.geometry.coordinates[1];
                    var lng = locationData.geometry.coordinates[0];
                    scope.user.location = lat + ',' + lng;
                    LocationService.getCityByLatLng(lat, lng)
                    .then(function (city) {
                      scope.user.locationName = city.canonical_name;
                      scope.isLocationEmpty = false;
                    });
                    scope.validZipcode = true;
                    scope.disableInvalidZipCodeMessage = false;
                  } else {
                    scope.isLocationEmpty = true;
                    scope.disableInvalidZipCodeMessage = true;
                  }
                });

            } else {
              scope.disableInvalidZipCodeMessage = false;
              scope.isLocationEmpty = true;
              scope.validZipcode = false;
            }
        });

      }
    };
  }

  angular.module('app.directives')
  .directive('vivaLoginSignUp',VivaLoginSignUp);

}());

(function  () {

	'use strict';

	VivaListItems.$inject = ['$rootScope', 'AdsItemService', '$auth', '$state', 'UtilsService', 'InstanceModal'];
	function VivaListItems ($rootScope, AdsItemService, $auth, $state, UtilsService, InstanceModal) {
    'ngInject';

		return {
			restrict: 'E',
			transclude: true,
			replace: true,
			templateUrl: 'views/partials/viva-list-items.directive.html',
			scope: {
				items : '=',
				openModal : '=',
				vivaLoader: '=',
				city: '='
			},
			link: function (scope, element, attr) {
				scope.firstCall = true;
				scope.scrollOptions = {
					busy: false
				};

				scope.getMoreItems = getMoreItems;
        scope.likeToggle = likeToggle;

        UtilsService.getItemsUrl(scope.items);

        scope.$watchCollection('items', watchItems);

        function getMoreItems () {
					scope.vivaLoader = true;
					scope.firstCall = false;
					$rootScope.$broadcast('vivalistItems.getMoreItems', scope.scrollOptions);

				}

        function likeToggle (item) {
					if($auth.isAuthenticated()) {
						AdsItemService.toggleLikeItem(item.id, !item.followedByUser)
						.then(function () {
							item.followedByUser = !item.followedByUser;
							item.totalOfFollowers = item.followedByUser ?
							item.totalOfFollowers + 1 :
							item.totalOfFollowers - 1;
						});
					}
					else {
						InstanceModal.loginModal({
  resolve: {
    DisplayTitleMessage: function () {
      return false;
    }
  }
});
					}
				}

        function watchItems (newV, oldV) {
          if (newV && newV.length) {
            UtilsService.getItemsUrl(scope.items);
          }
        }
			}
		};
	}

	angular.module('app.directives')
	.directive('vivaListItems',VivaListItems);

}());

(function() {
  'use strict';

  VivaCurrencyInput.$inject = ['$filter'];
  function VivaCurrencyInput ($filter) {
    'ngInject';

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function  (scope, ele, attr, ngModelCtr) {
        var lastValue = '';
        // ngModelCtr.$viewChangeListeners.push(parserToCurrency);
        ngModelCtr.$parsers.push(parseFromCurrency);
        function parserToCurrency () {
          if (ngModelCtr.$modelValue && ngModelCtr.$modelValue.length) {
            var inputValue = ngModelCtr.$modelValue;
            var transformedInput = inputValue ? inputValue.replace(/[^\d.-]/g,'') : inputValue;

            if (transformedInput!=inputValue) {
                ngModelCtr.$setViewValue(transformedInput);
                ngModelCtr.$render();
            }
            return lastValue;
          }
        }
        function parseFromCurrency (inputValue) {
          var transformedInput = inputValue ? inputValue.replace(/[^\d.-]/g,'') : inputValue;
          var validator = new RegExp(/^(\d{0,6}\.\d{0,2}|\d{0,6})$/);

          if (!validator.test(transformedInput)) {
            transformedInput = lastValue;
          }
          lastValue = transformedInput;
          ngModelCtr.$setViewValue('$' +transformedInput);
          ngModelCtr.$render();

          return transformedInput;
        }
      }
    }
  }

  angular.module('app.directives')
  .directive('vivaCurrencyInput',VivaCurrencyInput);
}());

(function  () {
    'use strict';

    VivaChatNegotiation.$inject = ['$compile', 'NegotiationService', 'UtilsService', '$timeout'];
    function VivaChatNegotiation ($compile, NegotiationService, UtilsService, $timeout) {
      'ngInject';

        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: 'views/partials/viva-chat.html',
            scope: {
              myConversation: '='
            },
            link: function (scope, element, attr) {
              var VIVA_ID_CHATS_CONTAINER = '#id-viva-chats-container';
              var IPHONE_FLAG = false;
              scope.sendChat = sendChat;
              scope.chatInput = '';

              if (UtilsService.isRunningOnMobile()) {
                var is_keyboard = false;
                var initial_screen_size = window.innerHeight;

                /* Android */
                window.addEventListener("resize", function() {
                    is_keyboard = (window.innerHeight < initial_screen_size);

                    updateViews();
                }, false);

                /* iOS */
                $("#textarea-message").bind("focus blur",function() {
                    // $(window).scrollTop(10);
                    // is_keyboard = $(window).scrollTop() > 0;
                    // $(window).scrollTop(0);
                    // is_keyboard = IPHONE_FLAG = !IPHONE_FLAG;
                    // updateViews();
                });
              }

              scope.$on('VIVA.chatNegotiation.appendChat', appendChat);
              scope.$on('VIVA.chatNegotiation.prependChat', prependChat);
              scope.$on('VIVA.chatNegotiation.offerAccepted', setOfferAccepted);
              scope.$on('VIVA.chatNegotiation.offerRejected', setOfferRejected);
              // scope.$on('VIVA.chatNegotiation.cleanInputBox', cleanInputBox);

              function appendChat (event, chatId) {
                var chatElement = $compile('<viva-chat-message chat="myConversation.hashChats['+chatId+']"></viva-chat-message>')(scope);
                $(VIVA_ID_CHATS_CONTAINER).append(chatElement);
                $timeout(function() {
                  $(VIVA_ID_CHATS_CONTAINER).animate({ scrollTop: $(VIVA_ID_CHATS_CONTAINER).prop("scrollHeight")}, 1000);
                },500);
              }

              function prependChat (event, chatId) {
                var chatElement = $compile('<viva-chat-message chat="myConversation.hashChats['+chatId+']"></viva-chat-message>')(scope);
                $(VIVA_ID_CHATS_CONTAINER).prepend(chatElement);
                $timeout(function() {
                  $(VIVA_ID_CHATS_CONTAINER).animate({ scrollTop: $(VIVA_ID_CHATS_CONTAINER).prop("scrollHeight")}, 1000);
                },500);
              }

              function setChats (chats) {
                chats.forEach(function (chat, index) {
                  var chatElement = $compile('<viva-chat-message chat="myConversation.hashChats['+chat.chatId+']"></viva-chat-message>')(scope);
                  $(VIVA_ID_CHATS_CONTAINER).prepend(chatElement);
                });
                $timeout(function() {
                  $(VIVA_ID_CHATS_CONTAINER).animate({ scrollTop: $(VIVA_ID_CHATS_CONTAINER).prop("scrollHeight")}, 1000);
                },500);
              }

              function sendChat () {
                if (scope.chatInput.length) {
                  scope.$emit('VIVA.chatNegotiation.sendChat', scope.chatInput);
                  scope.chatInput = '';
                }
              }

              $('#textarea-message').keypress(function (ev) {
                if (ev.which === 13) {
                  sendChat();
                  event.preventDefault();
                }
              });

              function updateViews () {
                if (is_keyboard) {
                  $('#id-viva-chats-container').height('28vh');
                } else {
                  $('#id-viva-chats-container').height('57vh');
                }
              }

              function setOfferAccepted () {
                var legendHtml = '<div class="accepted-offer"><b>¡Felicitaciones, cerraron un trato!</b> <span class="light-text">El anuncio fue marcado como vendido y sólo resta coordinar dónde y cuándo desean completar la transacción.</span></div>';
                $(VIVA_ID_CHATS_CONTAINER).append($compile(legendHtml)(scope));
              }

              function setOfferRejected () {
                var legendHtml = '<div class="rejected-offer"><div><b>La negociación ya no es válida.</b></div><div class="light-text">El anuncio no esta disponible</div></div>';
                $(VIVA_ID_CHATS_CONTAINER).append($compile(legendHtml)(scope));
              }

              function cleanInputBox () {
                scope.chatInput = '';
              }

              function scrollSafe (to) {
                if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
                 window.scrollTo(0,100) // first value for left offset, second value for top offset
                } else{
                  $timeout(function() {
                    $(VIVA_ID_CHATS_CONTAINER).animate({ scrollTop: $(VIVA_ID_CHATS_CONTAINER).prop("scrollHeight")}, 800,
                      function(){
                      $(VIVA_ID_CHATS_CONTAINER).clearQueue();
                    });
                  },500);
                }
              }

              if (scope.myConversation.conversation.conversationId) {
                setChats(scope.myConversation.conversation.chats);
              }
            }
        };
    }

    angular.module('app.directives')
    .directive('vivaChatNegotiation',VivaChatNegotiation);

}());

(function() {
  'use strict';

  VivaChatMessage.$inject = ['DateHandler', 'NegotiationService', '$filter', '$timeout'];
  function VivaChatMessage (DateHandler, NegotiationService, $filter, $timeout) {
    'ngInject';

    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      templateUrl: 'views/partials/viva-chat-message.html',
      scope: {
        chat: '='
      },
      link: function (scope, element, attr) {

        scope.userStyle = {};
        scope.postTime = formattName();
        scope.comment = scope.chat.comment;
        scope.isMyMessage = scope.chat.isMyMessage;
        scope.isAccepted = NegotiationService.isAccepted(scope.chat.action);
        scope.isRejected = NegotiationService.isRejected(scope.chat.action);
        $timeout(checkPostTime,300000);

        if (scope.chat.thumbnail) {
          scope.userStyle = {
            'background': 'url("'+scope.chat.thumbnail+'") center center / cover'
          }
        }

        if (NegotiationService.isOffer(scope.chat.action)) {
          scope.comment = scope.comment.toUpperCase();
          scope.comment += '<br><b>' + $filter('vivaCurrency')(scope.chat.offeredPrice) + '</b>';
        }

        if (scope.isAccepted) {
          scope.comment = '<b>' + scope.chat.comment + '</b> <span class="light-text">' + scope.chat.hint + '</span>';
        }

        if (scope.isRejected) {
          scope.comment = scope.chat.comment + '<br><span class="light-text">' + scope.chat.hint + '</span>';
        }

        if (scope.chat.action === 'MARKED_AS_SOLD') {
          var index = scope.comment.indexOf('.');
          var itemName = scope.comment.substr(11,index-11);
          scope.comment = scope.comment.replace(itemName, '<b>'+itemName+'</b>');
        }

        function formattName () {
          return scope.chat.username + ' · ' + DateHandler.formattDateToPostTime(parseInt(scope.chat.postTime));
        }

        function checkPostTime () {
          return scope.chat.username + ' · ' + DateHandler.formattDateToPostTime(parseInt(scope.chat.postTime));
        }

      }
    };
  }

  angular.module('app.directives')
  .directive('vivaChatMessage',VivaChatMessage);
}());

(function() {
  'use strict';

  VerifyEmailForm.$inject = ['$timeout', '$rootScope', '$auth', 'UserService', 'UtilsService', 'SmartBanner'];
  function VerifyEmailForm ($timeout, $rootScope, $auth, UserService, UtilsService, SmartBanner) {
    'ngInject';

    return {
      templateUrl: 'views/partials/verify-email-form.html',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        verifyEmail: '&',
        verifyemailCb: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.hasSuccess = false;

        var bannerWasVisible = false;

        $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams, options){
          $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function () {
          if (UtilsService.isRunningOnMobile() && SmartBanner.isVisible()) {
            SmartBanner.hideBanner();
            bannerWasVisible = true;
          }
        });

        $(element).on('hidden.bs.modal', function () {
          if (UtilsService.isRunningOnMobile() && bannerWasVisible) {
            SmartBanner.showBanner();
            bannerWasVisible = false;
          }
        });

        scope.verifyemailCb.cb = function (error, hasSuccess, backendValidated) {
          scope.error = error;
          scope.hasSuccess = hasSuccess;
        };

        //
        scope.sendVerification = function () {
          scope.verifyEmail();
        };

        $(element).on('hidden.bs.modal', function () {
          scope.hasSuccess = false;
          scope.error = '';
        });


      }
    };
  }

  angular.module('app.directives')
  .directive('verifyEmailForm', VerifyEmailForm);

}());

(function() {
  'use strict';

  ClickOff.$inject = ['$parse', '$document'];
  function ClickOff ($parse, $document) {
    'ngInject';

    var dir = {
        compile: function($element, attr) {
            // Parse the expression to be executed
            // whenever someone clicks _off_ this element.
            var fn = $parse(attr["clickOff"]);
            return function(scope, element, attr) {
                // add a click handler to the element that
                // stops the event propagation.
                element.bind("click", function(event) {
                    event.stopPropagation();
                });
                angular.element($document[0].body).bind("click", function(event) {
                    scope.$apply(function() {
                        fn(scope, {$event:event});
                    });
                });
            };
        }
    };
    return dir;
  }

  angular.module('app.directives')
  .directive('clickOff', ClickOff);

}());

(function() {
  'use strict';

  Spinner.$inject = ['$timeout', '$rootScope', 'UtilsService'];
  function Spinner ($timeout, $rootScope, UtilsService) {
    'ngInject';

    return {
      templateUrl: 'views/partials/spinner.html',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        loading: '=?',
        serviceId: '@?'
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  }

  angular.module('app.directives')
  .directive('spinner', Spinner);

}());


(function() {
  'use strict';

  ScrollEvents.$inject = ['$state', '$window', 'UtilsService'];
  function ScrollEvents ($state, $window, UtilsService) {
    'ngInject';

    return function(scope, element, attrs) {
      angular.element($window).bind("scroll", function() {
        if($state.current.name == 'homeLocation' || $state.current.name.startsWith('home.') ){
          var bgHeight = angular.element(document.querySelector('.bg-color'))[0].offsetHeight;
          scope.bgColor = {'background-color': 'rgba(0, 217, 220,' + (0 + this.pageYOffset/bgHeight) + ')'};
          scope.bgSloganPosition = {'background-position-y': 245 + this.pageYOffset + 'px'};
          scope.bgPhonesPosition = {'background-position-y': 136 + this.pageYOffset*1.2 + 'px'};
          if ($window.innerWidth > 768 && this.pageYOffset > (bgHeight - 130)) {
              scope.isScrolled = true;
          } else {
              scope.isScrolled = false;
          }
          // if ($window.innerWidth <= 768) {
          //   scope.hideSearch = true;
          // }
          scope.$apply();
        } else { // if the app is in a different page from home, set vars to initial values, so when it comes back to home everything is in the right position
          scope.bgColor = {'background-color': 'rgba(0, 217, 220, 0)'};
          scope.bgSloganPosition = {'background-position-y': '245px'};
          scope.bgPhonesPosition = {'background-position-y': '136px'};
        }
      });
    };
  }

  angular.module('app.directives')
  .directive("scrollEvents", ScrollEvents);

}());

/**
 * Created by neto on 04/04/16.
 */
(function() {
  'use strict';

  RateInfo.$inject = ['UserService', '$timeout'];
  function RateInfo (UserService, $timeout) {
    'ngInject';

    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      templateUrl: 'views/partials/modal-rate-info.directive.html',
      scope: {
        userPromise: '='
      },
      link: function (scope, element, attrs) {

        var currentTime = (new Date).valueOf().toString();

        scope.ratesBuyer = [];
        scope.hasMoreSeller = true;
        scope.pageBuyer = 0;

        scope.ratesSeller = [];
        scope.hasMoreBuyer = true;
        scope.pageSeller = 0;

        scope.pageSize = 100;

        scope.moreRates = function (type) {
          var options = {
            pageSize: scope.pageSize,
            username: scope.user.username
            // requestTime: new Date()
          };
          if (type === 'buyer') {
            options['role'] = 'buyer';
            options['page'] = scope.pageBuyer;
          } else {
            options['role'] = 'seller';
            options['page'] = scope.pageSeller;
          }
          UserService.listRates(options)
            .then(function (response) {
              var rates = response.data.ratings;
              var totalElements = response.data.totalElements;
              if (type === 'buyer') {
                scope.ratesBuyer = scope.ratesBuyer.concat(rates);
                if(totalElements > scope.pageSize * scope.pageBuyer){
                  scope.pageBuyer++;
                } else {
                  scope.hasMoreBuyer = false;
                }
              } else {
                scope.ratesSeller = scope.ratesSeller.concat(rates);
                if(totalElements > scope.pageSize * scope.pageSeller){
                  scope.pageSeller++;
                } else {
                  scope.hasMoreSeller = false;
                }
              }
            });
        };
        scope.userPromise.then(function (user) {
          scope.user = user.data;
          scope.moreRates('buyer');
          scope.moreRates('seller');
        });
      }
    }
  }

  angular.module('app.directives')
  .directive('rateInfo', RateInfo);

}());


/**
 * Created by neto on 04/04/16.
 */
(function() {
  'use strict';

  ModalGroupSubscribers.$inject = ['GroupService', '$timeout', '$auth', 'FollowUserService', '$rootScope', '$state'];
  function ModalGroupSubscribers (GroupService, $timeout, $auth, FollowUserService, $rootScope, $state) {
    'ngInject';

    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      templateUrl: 'views/partials/modal-group-subscribers.directive.html',
      scope: {
        groupSubscribers: '=',
        groupName: '=',
        hasMoreSubscribers: '=',
        getMoreSubscribers: '&',
        scrollBusy: '='
      },
      link: function (scope, element, attrs) {
        scope.hasMore = true;
        scope.usernameLogged = '';

        var defaultImage = '../../../images/vivanuncios/avatar_ph_image_4.svg';
        var isOpened = false;

        if ($auth.isAuthenticated()) {
          scope.usernameLogged = $auth.getPayload().username;
        }

        $('#modal-group-subscribers').on('shown.bs.modal', function () {
          isOpened = true;
          scope.groupName = scope.groupName.replace(/\.$/,"");
          $('#suscribers-scroll-content').animate({ scrollTop: 0 }, 0);
        });

        $('#modal-group-subscribers').on('hidden.bs.modal', function () {
          isOpened = false;
        });

        scope.toggleFollowUser = function  (subscriber) {
          FollowUserService.toggleFollowUser(subscriber.username, subscriber.followedByUser, function () {
            subscriber.followedByUser = !subscriber.followedByUser;
            subscriber.isFollowed = scope.isAuthenticated() && subscriber.followedByUser;
          }, function (message) {
            if (message === 'no-auth') {
              $('#modal-group-subscribers').modal('hide');
            }
          });
        };

        scope.isAuthenticated = function () {
          return $auth.isAuthenticated();
        };

        scope.getMore = function () {
          scope.getMoreSubscribers();
        };

        scope.setBackground = function(picture) {
          var style = {};
          if (picture) {
            style['background-image'] = 'url('+picture+')';
          } else {
            style['background-image'] = 'url('+defaultImage+')';
          }
          return style;
        };

        scope.visitProfile = function (username) {
          $('#modal-group-subscribers').modal('hide');
          $state.go('userProfile',{id:username});
        }

        scope.$on('$stateChangeStart',function () {
          if (isOpened) {
            $('#modal-group-subscribers').modal('hide');
          }
        });

      }

    }
  }

  angular.module('app.directives')
  .directive('modalGroupSubscribers', ModalGroupSubscribers);

}());


/**
 * Created by neto on 04/04/16.
 */
(function() {
  'use strict';

  ModalFollowersFollowings.$inject = ['$auth', '$filter', '$rootScope', '$state', '$timeout', 'FollowUserService', 'SmartBanner', 'UserService', 'UtilsService'];
  function ModalFollowersFollowings (
    $auth,
    $filter,
    $rootScope,
    $state,
    $timeout,
    FollowUserService,
    SmartBanner,
    UserService,
    UtilsService
  ) {
    'ngInject';

    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      templateUrl: 'views/partials/modal-followers-followings.directive.html',
      scope: {
        userInfo: '=',
        followers: '=',
        followings: '=',
        retriveFollowers: '&',
        retriveFollowings: '&',
        tabActive: '='
      },
      link: function (scope, element, attrs) {

        var defaultImage = '../../../images/vivanuncios/avatar_ph_image_4.svg';
        var defaultImage = '../../../images/vivanuncios/avatar_ph_image_4.svg';
        var isOpened = false;
        var updateFollowers = false;
        scope.usernameLogged = '';
        scope.titleTxt = '';
        scope.followersCopy = [];
        scope.followingsCopy = [];


        if ($auth.isAuthenticated()) {
          scope.usernameLogged = $auth.getPayload().username;
        }

        var bannerWasVisible = false;

        $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams, options){
          $('#modal-followers-followings').modal('hide');
        });

        $('#modal-followers-followings').on('shown.bs.modal', function () {
          isOpened = true;
          scope.followingsCopy = angular.copy(scope.followings);
          scope.followersCopy = angular.copy(scope.followers);
          $('.tab-pane').animate({ scrollTop: 0 }, 0);
          if (scope.usernameLogged === scope.userInfo.username) {
            updateFollowers = true;
          }
          updateTitle();

          if (UtilsService.isRunningOnMobile() && SmartBanner.isVisible()) {
            SmartBanner.hideBanner();
            bannerWasVisible = true;
          }

          scope.$apply();
        });

        $('#modal-followers-followings').on('hidden.bs.modal', function () {
          isOpened = false;
          if (UtilsService.isRunningOnMobile() && bannerWasVisible) {
            SmartBanner.showBanner();
            bannerWasVisible = false;
          }
        });

        $('#tabs-follwer-following a:first').on('shown.bs.tab',function () {
          scope.tabActive.active = 'followings';
        });

        $('#tabs-follwer-following a:last').on('shown.bs.tab',function () {
          scope.tabActive.active = 'followers';
        });

        function updateTitle () {
           if (scope.tabActive.active === 'followings') {
            scope.titleTxt = 'Siguiendo (' + scope.followingsCopy.length + ')';
            $('#tabs-follwer-following a:first').tab('show');
          } else if (scope.tabActive.active === 'followers') {
            scope.titleTxt = 'Seguidores (' + scope.followersCopy.length +')';
            $('#tabs-follwer-following a:last').tab('show');
          }
        }

        scope.isAuthenticated = function () {
          return $auth.isAuthenticated();
        };

        var followersPromise = function (username) {
          return UserService.getFollowers(username, $auth.isAuthenticated())
            .then(function (resp) {
              var followers = resp.data.users;
              scope.followers = followers;
            });
        };
        var followingsPromise = function (username) {
          return UserService.getFollowings(username, $auth.isAuthenticated())
            .then(function (resp) {
              var followings = resp.data.users;
              scope.followings = followings;
            });
        };

        var isOnArray = function (array, element) {
          return $filter('filter')(array, function (val, index, arr) {
            return val.userId === element.userId;
          }).length > 0;
        }

        scope.toggleFollowUser = function  (followering) {
          FollowUserService.toggleFollowUser(followering.username, followering.followedByUser, function  () {
            followering.followedByUser = !followering.followedByUser;


            if (scope.tabActive.active === 'followings') {
              followersPromise(scope.userInfo.username)
              .then(function () {
                scope.followersCopy = angular.copy(scope.followers);
                updateTitle();
              });
              followingsPromise(scope.userInfo.username);
            } else {
              followingsPromise(scope.userInfo.username)
              .then(function () {
                if ( !updateFollowers ) {
                  scope.followingsCopy = angular.copy(scope.followings);
                } else if ( isOnArray(scope.followingsCopy, followering) ) {
                  angular.forEach(scope.followingsCopy,function (val, index) {
                    if (val.userId === followering.userId) {
                      val.followedByUser = followering.followedByUser;
                    }
                  });
                } else {
                  scope.followingsCopy.push(followering);
                  scope.followingsCopy = $filter('orderBy')(scope.followingsCopy, 'userId');
                }

                updateTitle();

              });
              followersPromise(scope.userInfo.username);
            }

          }, function (message) {
            if (message === 'no-auth') {
              $('#modal-followers-followings').modal('hide');
            }
          });
        };

        scope.setBackground = function(picture) {
          var style = {};
          if (picture) {
            style['background-image'] = 'url('+picture+')';
          } else {
            style['background-image'] = 'url('+defaultImage+')';
          }
          return style;
        };

        scope.visitProfile = function (username) {
          $('#modal-followers-followings').modal('hide');
          $state.go('userProfile',{id:username});
        }

        scope.$on('$stateChangeStart',function () {
          if (isOpened) {
            $('#modal-followers-followings').modal('hide');
          }
        });

      }
    }
  }

  angular.module('app.directives')
  .directive('modalFollowersFollowings', ModalFollowersFollowings);

}());

(function() {
  'use strict';

  function ModalDialog () {

    return {
      template: '<div id="{{ id }}" class="modal" style="{{ style }}">' +
          '<div class="modal-dialog">' +
            '<div class="modal-content">' +
              '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                '<h4 class="modal-title">{{ title }}</h4>' +
              '</div>' +
              '<div class="modal-body" ng-transclude></div>' +
            '</div>' +
          '</div>' +
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.id = attrs.id;
        scope.title = attrs.title;
        scope.style = attrs.style;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  }

  angular.module('app.directives')
  .directive('modalDialog', ModalDialog);
}());

/**
 * Mapbox forward geocoding autocomplete directive
 * https://github.com/Mike-Loffland/angular-mapbox-forward-geolocation-directive
 */

(function () {
    'use strict';

  MapboxForwardGeocoding.$inject = ['$http', '$timeout', 'LocationService'];
    function MapboxForwardGeocoding ($http, $timeout, LocationService) {
      'ngInject';

      return {
          restrict: 'AE',
          scope: {
              selectedLocation: '=',
              queryResults: '=',
              options: '=',
              apiToken: '=',
              searchText: '='
          },
          templateUrl: 'views/partials/forward-geolocation.html',
          link: function (scope, element, attrs) {

              scope.suggestions = [];
              scope.flagminerror = false;
              //scope.searchText = attrs.searchText === '$parent.inputText.location' ? '' : $parent.inputText.location;
              //scope.searchText = attrs.searchText;
              scope.searchTextTemp = '';
              scope.charQty = 15;
              scope.selectedLocationAvailable = angular.isDefined(attrs.selectedLocation);
              scope.wantResults = angular.isDefined(attrs.queryResults);
              // set defaults
              scope.apiToken = scope.apiToken ? scope.apiToken : 'YOU NEED TO SET YOUR API TOKEN';

              angular.extend(scope, {
                  // allow directive user to specify their own placeholder text
                  placeHolderText: 'Search for an address',
                  // allow directive user to specify their own placeholder text
                  minLengthErrorText: 'Search text must be at least %N% character(s).',
                  // allow directive user to determine what property they want to be used in the auto suggest results
                  displayProperty: 'place_name',
                  // allow directive user to exclude results where place_name is empty or absent in the mapbox results
                  excludeEntriesWithNoPlaceName: false,
                  // allow directive user to enable auto suggest
                  autoSuggest: true,
                  // allow directive user to specify their own string to use if displayProperty is empty
                  emptyPropertyText: '(empty property)',
                  // allow directive user to specify their own min length for determining when a search string is long enough to execute a query
                  minLength: 4,
                  // attempt to limit the Mapbox query results based on a keyword
                  includeThisKeyword: undefined
              });

              // use custom directive options if present
              if (!angular.isUndefined(scope.options)) {
                  angular.extend(scope, scope.options);

              }

              scope.minLengthErrorText = scope.minLengthErrorText.replace('%N%', scope.minLength);

              scope.search = function (src) {

                  if (angular.isUndefined(scope.searchText.searchLocationText) || (src == 'button' && !scope.wantResults)) {
                      // scope.searchText.searchLocationText will continue to be undefined until the ng-minlength requirements are met
                      // ||
                      // this is a button click... but, the directive user did not provide a scope variable for queryResults
                      return;
                  }
                  var localSearchText,
                      myurl;


                  if (scope.searchText.searchLocationText.length < scope.minLength) {
                      scope.flagminerror = true;
                      scope.suggestions = [];
                      return;
                  }

                  localSearchText = encodeURI(scope.searchText.searchLocationText);

                  // attempting to increase the relevance of Mapbox query results based on a keyword
                  // - i.e: includeThisKeyword = 'texas'
                  //    > should produce results more specific to Texas
                  if (scope.includeThisKeyword) {
                      if (localSearchText.toLowerCase().indexOf(scope.includeThisKeyword.toLowerCase()) < 0) {
                          localSearchText += '+' + scope.includeThisKeyword;
                      }
                  }

                  //myurl = 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places/' + localSearchText + '.json?access_token=' + scope.apiToken;

                  var typesCriteria = 'types=place&';
                  myurl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
                  + localSearchText
                  + '.json?'
                  + typesCriteria
                  + 'access_token=' + scope.apiToken;

                  $http.get(myurl)
                      .success(function (data) {
                          scope.suggestions = data.features.map(function (val) {
                              var mapped = LocationService.mapFeature(val);
                              // if the directive user wants to exclude results where place_name is empty or absent
                              if (scope.excludeEntriesWithNoPlaceName) {
                                  if (val.place_name) {
                                      return mapped;
                                  }
                              } else {
                                  return mapped;
                              }
                          }).filter(function (val) {
                              if (angular.isUndefined(val.context)) {
                                  return false;
                              } else {
                                  return val.context.length > 0 && (val.context.slice(-1)[0]['short_code'] === 'us' || val.context.slice(-1)[0]['short_code'] === 'pr');
                              }
                          });
                          // if the directive user wants the results returned to their own scope array
                          if ((src == 'button' && scope.wantResults)) {
                              scope.queryResults = scope.suggestions.slice(0);
                              scope.selectedLoc = scope.searchText.searchLocationText;
                              scope.searchText.searchLocationText = '';
                              scope.suggestions = [];
                          }

                      })
                      .error(function (data, status) {
                          var errorObj = {}, msg;
                          // empty the suggestion array
                          while (scope.suggestions.length > 0) {
                              scope.suggestions.pop();
                          }
                          msg = "Error al obtener las opciones de la busqueda";
                          errorObj[scope.displayProperty] = msg;
                          scope.suggestions.push(errorObj);
                      });
              };

              scope.useSelectedLocation = function (index) {
                  scope.selectedLocation = scope.suggestions[index];
                  scope.searchText.searchLocationText = scope.selectedLoc = scope.searchTextTemp = scope.selectedLocation.canonical_name;
                  scope.$root.$emit("location.changeMap", scope.selectedLocation);
                  // console.log(scope.searchText);
                  scope.suggestions = [];
              };

              scope.confirmSelection = function () {
                if (scope.selectedLocation !== undefined) {
                  scope.$root.$emit("location.changed", scope.selectedLocation);
                } else {
                  scope.$root.$emit("location.cancel");
                }

              };

              scope.$on('geolocation.update', function(event, newLocation) {
                scope.selectedLocation = newLocation;
              });

              scope.$on('searchNewLocation', function (event, searchTextLocation, callback) {
                  scope.searchText.searchLocationText = searchTextLocation;
                  scope.search();
                  document.querySelector('#mbac-searchInput').focus();
                  if (callback) {
                      callback();
                  }
              });
          }
      }
  }

    angular.module('app.directives')
    .directive('mapboxForwardGeocoding', MapboxForwardGeocoding);

}());

(function() {
  'use strict';

  FixedNavbar.$inject = ['$state', 'screenSize'];
  function FixedNavbar ($state, screenSize) {
    'ngInject';

    return function (){

      $(window).scroll(function(){
        var navbar = $('.search-bar-container');
        var homebar = $('.border-back-home');
        var scrollTop = 300;
        var x = $(window).scrollTop();
        var body = $('body');
        if($state.current.name == 'home' || $state.current.name.startsWith('home.') ){
          body.removeClass('wrapbar');
          // console.log($state.current.name);
          if(x <= scrollTop){
            navbar.removeClass('stuck-navbar-home');
            homebar.removeClass('stuck-home');
            body.removeClass('wrapbar-home');

          }else{
            navbar.addClass('stuck-navbar-home');
            homebar.addClass('stuck-home');
            body.addClass('wrapbar-home');
            body.removeClass('wrapbar');

          }

        }else{
          navbar.addClass('stuck');
          body.addClass('wrapbar');
          body.removeClass('wrapbar-home');
          //console.log($state.current.name);

        }
      });
    };
  }

  angular.module('app.directives')
  .directive('fixedNavbar', FixedNavbar);

}());


(function() {
  'use strict';

  EditZipcodeForm.$inject = ['$timeout', '$rootScope', 'UtilsService', 'LocationService', '$auth', 'UserService', 'SmartBanner'];
  function EditZipcodeForm ($timeout, $rootScope, UtilsService, LocationService, $auth, UserService, SmartBanner) {
    'ngInject';

    return {
      templateUrl: 'views/partials/edit-zipcode-form.html',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        zipcodeCb: '=',
        editZipcode: '&'
      },
      link: function postLink(scope, element, attrs) {
        scope.zipcode = '';
        scope.isLocationEmpty = true;
        scope.disableInvalidZipCodeMessage = false;

        var bannerWasVisible = false;


        scope.zipcodeCb.cb = function (error, hasSuccess, backendValidated) {
          scope.error = error;
          scope.hasSuccess = hasSuccess;
          scope.backendValidated = backendValidated;
          if (hasSuccess) {
            $(element).modal('hide');
          }
        };

        $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams, options){
          $(element).modal('hide');
        });

        scope.$watch('editZipcodeForm.zipCode.$valid',
        function(validity) {
          if (validity) {
            LocationService.getCityByZipcode(editZipcodeForm.zipCode.value)
            .then(function (data) {
              var locationData = data.features[0];
              if (locationData != undefined) {
                var lat = locationData.geometry.coordinates[1];
                var lng = locationData.geometry.coordinates[0];
                scope.location = lat + ',' + lng;
                LocationService.getCityByLatLng(lat, lng)
                .then(function (city) {
                  scope.locationName = city.canonical_name;
                  scope.isLocationEmpty = false;
                });
                scope.validZipcode = true;
                scope.disableInvalidZipCodeMessage = false;
              } else {
                scope.isLocationEmpty = true;
                scope.disableInvalidZipCodeMessage = true;
              }
            });
          } else {
            scope.disableInvalidZipCodeMessage = false;
            scope.isLocationEmpty = true;
            scope.validZipcode = false;
          }
        });

        $(element).on('shown.bs.modal', function () {
          if ($auth.isAuthenticated()) {
            scope.user = {
              username: $auth.getPayload().username,
              profilePicture: $auth.getPayload().profilePicture
            };
            UserService.getByUsername($auth.getPayload().username).then(
            function (resp) {
              scope.user.email = resp.data.email;
              scope.user.zipCode = resp.data.zipCode;
              scope.locationName = resp.data.locationName;
            });
          }
          if (UtilsService.isRunningOnMobile() && SmartBanner.isVisible()) {
            SmartBanner.hideBanner();
            bannerWasVisible = true;
          }
        });

        scope.submit = function () {
          scope.editZipcode({
            location: {
              zipCode: editZipcodeForm.zipCode.value,
              location: scope.location,
              locationName: scope.locationName
            }
          });
        };

        scope.runningOnMobile = function () {
          return UtilsService.isRunningOnMobile();
        };

        $(element).on('hidden.bs.modal', function () {
          scope.zipcode = '';
          scope.error = '';
          scope.hasSuccess = false;
          scope.backendValidated = false;
          scope.isLocationEmpty = false;
          scope.validZipcode = false;
          scope.disableInvalidZipCodeMessage = false;
          if (UtilsService.isRunningOnMobile() && bannerWasVisible) {
            SmartBanner.showBanner();
            bannerWasVisible = false;
          }
        });


      }
    };
  }

  angular.module('app.directives')
  .directive('editZipcodeForm', EditZipcodeForm);

}());


(function() {
  'use strict';

  CustomItemImage.$inject = ['$parse', '$document', '$timeout'];
  function CustomItemImage ($parse, $document, $timeout) {
    'ngInject';

    var getImageAlt = function (index, thumbnail, description, photoCount) {
      if(thumbnail){
        return description + ' thumbnail ' + (parseInt(index) + 1);
      }
      if(photoCount > 1){
        return description + ' image ' + (parseInt(index) + 1);
      } else {
        return description;
      }
    };
    return {
      restrict: 'E',
      scope: {itemId:"=", imgNumber:"="},
      template: "<div afkl-lazy-image='{{ imgPath }}{{ itemId }}{{ imageHtmlParam }}{{ sizeParams }}{{ numberHtmlParam }}{{ imgNumber }}' class='afkl-lazy-wrapper afkl-img-ratio-1-1' afkl-lazy-image-options='{{ altt }}'></div>",
      link: function (scope,element,attrs) {


        scope.thumbnail = attrs.thumb;
        scope.description = attrs.description;
        scope.photoCount = attrs.photocount;


        //force the image preloading
        scope.imgPath = '/images/preload_item_image.png';
        scope.itemId = '';
        scope.imageHtmlParam = '';
        scope.sizeParams = '';
        scope.numberHtmlParam= '';
        scope.imgNumber = '';
        scope.altt = '';

        //mySercer.com/v1/items/568c212f9655ed736585caab/image?number=0
        var generateImagePath = function(){
          //generate the real image path
          scope.imgPath = appConfig.imgUrlTemplate;
          scope.itemId = attrs.itemid;
          scope.imageHtmlParam = '/image?';
          scope.sizeParams = '';
          scope.numberHtmlParam= 'number=';
          scope.imgNumber = attrs.imgnumber;

          if (attrs.width){
            scope.sizeParams += 'width=' + attrs.width + '&'
          }
          if (attrs.height){
            scope.sizeParams += 'height=' + attrs.height + '&'
          }

          //for non static images, observe attributes changes and refresh local directive scope
          if(!attrs.isstatic){
            attrs.$observe('itemid', function (newValue) {
              scope.itemId = newValue
            });
            attrs.$observe('imgnumber', function (newValue) {
              scope.imgNumber = newValue;
              scope.altt = getImageAlt(scope.imgNumber, scope.thumbnail, scope.description, scope.photoCount);
            });
            attrs.$observe('description', function (newValue) {
              scope.description = newValue;
              scope.altt = getImageAlt(scope.imgNumber, scope.thumbnail, scope.description, scope.photoCount);
            });
            attrs.$observe('photocount', function (newValue) {
              scope.photoCount = newValue;
              scope.altt = getImageAlt(scope.imgNumber, scope.thumbnail, scope.description, scope.photoCount);
            });
          }

        }
        $timeout(generateImagePath,50);
        if(attrs.myalt){
          scope.altt = '{"alt":"'+attrs.myalt+'"}';
        }
      }
    };
  }

  angular.module('app.directives')
  .directive('customItemImage', CustomItemImage);

}());

(function() {
  'use strict';

  ChangePasswordForm.$inject = ['$timeout', '$rootScope', 'UtilsService', 'SmartBanner', '$auth', '$state', 'UserService', 'InstanceModal'];
  function ChangePasswordForm ($timeout, $rootScope, UtilsService, SmartBanner, $auth, $state, UserService, InstanceModal) {
    'ngInject';

    return {
      templateUrl: 'views/partials/change-password-form.html',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        passwordCb: '=',
        changePassword: '&'
      },
      link: function postLink(scope, element, attrs) {
        scope.currentPassword =
          scope.newPassword =
          scope.newPasswordConfirm =
          scope.error = '';
        scope.hasSuccess = false;
        scope.backendValidated = false;

        var bannerWasVisible = false;

        $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams, options){
          $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function () {
          if (UtilsService.isRunningOnMobile() && SmartBanner.isVisible()) {
            SmartBanner.hideBanner();
            bannerWasVisible = true;
          }
        });

        scope.passwordCb.cb = function (error, hasSuccess, backendValidated) {
          // $timeout(function(){
          scope.error = error;
          scope.hasSuccess = hasSuccess;
          scope.backendValidated = backendValidated;
          // });
        };

        // scope.passwordCb.cb('asdjfoaisjdfa', false)

        scope.submit = function () {
          if (scope.newPassword.length >= 6) {
          // if (true) {
            scope.changePassword({
              passwords: {
                currentPassword: scope.currentPassword,
                newPassword: scope.newPassword
              }
            });
          } else {
            $timeout(function () {
              scope.error = 'Debe contener al menos 6 caracteres';
              scope.hasSuccess = false;
              scope.backendValidated = true;
            });
          }
        };

        scope.runningOnMobile = function () {
          return UtilsService.isRunningOnMobile();
        };

        scope.enableConfirmBtn = function () {
          if (scope.backendValidated) {
            return true;
          }
          if (scope.currentPassword && scope.newPassword && scope.newPasswordConfirm) {
            if (scope.newPassword === scope.newPasswordConfirm) {
              scope.error = '';
              return true;
            } else {
              scope.error = 'La nueva contraseña y su confirmación deben ser iguales.';
              return false;
            }
          }
          return false;
        };

        scope.showLoginForm = function () {
          UserService.signOut()
          .then(function (response) {
            $auth.logout();
            $state.reload();
            InstanceModal.loginModal({
  resolve: {
    DisplayTitleMessage: function () {
      return false;
    }
  }
});
          });
        };

        $(element).on('hidden.bs.modal', function () {
          scope.currentPassword = '';
          scope.newPassword = '';
          scope.newPasswordConfirm = '';
          scope.error = '';
          scope.hasSuccess = false;
          scope.backendValidated = false;
          if (UtilsService.isRunningOnMobile() && bannerWasVisible) {
            SmartBanner.showBanner();
            bannerWasVisible = false;
          }
        });
      }
    };
  }

  angular.module('app.directives')
  .directive('changePasswordForm', ChangePasswordForm);

}());

(function () {
  'use strict';

  VivaSessionExpiredController.$inject = ['$scope', '$auth', '$state', '$uibModalInstance'];
  function VivaSessionExpiredController ($scope, $auth, $state, $uibModalInstance) {
    'ngInject';

    $scope.reload = reload;

    $auth.logout();
    $state.reload();

    function reload() {
      $uibModalInstance.dismiss('cancel');
    }
  }

  angular.module('vivaApp')
  .controller('VivaSessionExpiredController', VivaSessionExpiredController);
}());

(function() {
  'use strict';

  VivaFooterController.$inject = ['$scope'];
  function VivaFooterController ($scope) {
    'ngInject';

    $scope.$on('$stateChangeSuccess', shouldShowFooter);
    $scope.shouldShowFooter = true;

    function shouldShowFooter (event, toState, toParams, fromState, fromParams) {
      $scope.shouldShowFooter = toState.name !== 'negotiationItem'
      && toState.name !== 'negotiation'
      && toState.name !== 'negotiationsList'
      && toState.name !== 'negotiationsListItem';
    }
  }

  angular.module('app.controllers')
  .controller('VivaFooterController',VivaFooterController);
}());

(function() {
  'use strict';

  UserProfileController.$inject = ['$rootScope', '$scope', '$window', 'AdsItemService', 'UserService', '$stateParams', '$state', 'UtilsService', '$auth', 'FollowUserService', 'InstanceModal'];
  function UserProfileController ($rootScope, $scope, $window, AdsItemService, UserService, $stateParams, $state, UtilsService, $auth, FollowUserService, InstanceModal) {
    'ngInject';

    var page = 0;
    var totalPages = 0;

    var pageSize = UtilsService.isRunningOnMobile() ? 4 : 25;
    var username = $stateParams.id;

    $scope.followersPromise = function (username) {
      UserService.getFollowers(username, $auth.isAuthenticated())
        .then(function (resp) {
          var followers = resp.data.users;
          $scope.followers = followers;
        });
    };
    $scope.followingsPromise = function (username) {
      UserService.getFollowings(username, $auth.isAuthenticated())
        .then(function (resp) {
          var followings = resp.data.users;
          $scope.followings = followings;
        });
    };

    $scope.items = [];
    $scope.followers = [];
    $scope.followings = [];
    $scope.hasMore = true;
    $scope.loadingProfile = true;
    $scope.loadingItems = false;
    $scope.userPromise = UserService.getByUsername(username);
    $scope.runningOnMobile = UtilsService.isRunningOnMobile();
    $scope.tabModalFollowersFollowings = {};
    $scope.tabModalFollowersFollowings.active = '';
    $scope.isUserLogged = false;
    // $scope.cbFollowers = function () {
    //   followersPromise();
    // };
    // $scope.cbFollowings = function () {
    //   followingsPromise();
    // };
    $scope.cb = function () {
      UserService.getByUsername(username).then(function (resp) {
        $scope.user = resp.data;
      });
      $scope.followersPromise(username);
      $scope.followingsPromise(username);
    };

    $scope.isFollowed = FollowUserService.isFollowed;
    $scope.isLoggedUser = FollowUserService.isLoggedUser;
    $scope.toggleFollowUser = FollowUserService.toggleFollowUser;

    $scope.userPromise.then(function (resp) {
      if(resp.statusCode === 1){
        $rootScope.$emit('newMetaData', UtilsService.newMetadata($scope.metadata, {
          'title': resp.data.username + ' vende en ' + resp.data.locationName + ' ' + resp.data.zipCode + ' | Vivanuncios Estados Unidos',
          'canonical': 'http://www.vivanuncios.com/profile/' + UtilsService.$formatURLString(resp.data.username)
        }));
        $scope.user = resp.data;
        if ($auth.getPayload()) {
          $scope.isUserLogged = $auth.getPayload().username === $scope.user.username;
        }
        $scope.followersPromise(resp.data.username);
        $scope.followingsPromise(resp.data.username);
        $scope.loadItems();
        $scope.hasSocial = function (social) {
          var userSocials = $scope.user.userSocials;
          if (userSocials === undefined) {
            return false;
          }
          return ( userSocials.indexOf(social) != -1);
        };
      } else {
        $state.go('error.profileNotFound');
      }
      $scope.loadingProfile = false;
      $scope.loadingItems = true;
    });

    $scope.loadItems = function () {
      if (page === 0 || page < totalPages) {
        AdsItemService.findByUser($scope.user.username, {page: page, pageSize: pageSize}).then(function (resp) {
          $scope.items = $scope.items.concat(resp.data.items);
          UtilsService.getItemsUrl($scope.items);
          totalPages = resp.data.totalPages;
          page++;
          $scope.hasMore = page < totalPages;
          $scope.loadingItems = false;
        })
      }
    };

    $scope.likeToggle = function (item) {
      if ($scope.isAuthenticated()) {
        if (item.status === 'ACTIVE') {
          AdsItemService.toggleLikeItem(item.id, !item.followedByUser).then(function () {
            item.followedByUser = !item.followedByUser;
            item.totalOfFollowers = item.followedByUser ?
            item.totalOfFollowers + 1 :
            item.totalOfFollowers - 1;
          });
        }
      } else {
        InstanceModal.loginModal({
  resolve: {
    DisplayTitleMessage: function () {
      return false;
    }
  }
});
      }
    };

    $scope.$formatDate = function (strDate) {
      if (typeof strDate === 'undefined') {
        return "";
      }
      return moment.unix(strDate).format("MM/DD/YYYY");
    };

  }

  angular.module('app.controllers')
  .controller('UserProfileController', UserProfileController);

}());

(function() {
  'use strict';

  TrendingNowController.$inject = ['$scope', 'AdsItemService', 'SearchModelFactory'];
  function TrendingNowController ($scope, AdsItemService, SearchModelFactory) {
    'ngInject';

    $scope.trendingNowList = [];

    //watch changes on MainSeachData
    $scope.$watch(
      function(  ) {
        //When the return value change, the second function is called
        return( SearchModelFactory.location.id );
      },
      function( newValue, oldValue ) {

        $scope.getTrendingNowFiltered();
        //This is the place to process the new data. For example query the services again
      }
    );

    $scope.getTrendingNowFiltered = function () {

        AdsItemService.getTrendingItems(SearchModelFactory.location.latitude, SearchModelFactory.location.longitude)
        .then(function (result) {
            $scope.trendingNowList = result;
        });
    };

      $scope.theresTrendingNowItems=function(){
          return ($scope.trendingNowList.length > 0);
      }

    $scope.init = function () {
      this.getTrendingNowFiltered();
    };

    $scope.init();
  }

  angular.module('app.controllers')
  .controller('TrendingNowController', TrendingNowController);

}());

(function() {
  'use strict';

  TopSellersController.$inject = ['$scope', 'AdsItemService', 'SearchModelFactory', '$stateParams', 'LocationService'];
  function TopSellersController ($scope, AdsItemService, SearchModelFactory, $stateParams, LocationService) {
    'ngInject';
    $scope.topSellersList = [];
    $scope.loading = true;
    $scope.page = 1;
    $scope.imgPathUrl = appConfig.imgUrlTemplate;

    $scope.theresTopSellersItems = function () {
      return ($scope.topSellersList.length > 0)
    };

    $scope.getTopSellersPaged = function () {
      LocationService.getCityById($stateParams.locationId).then(function (city) {
        AdsItemService.getTopSellers(city.latitude, city.longitude, $scope.page)
          .then(function (result) {
            $scope.topSellersList = $scope.topSellersList.concat(result.rows);
            $scope.hasMoreTopSellers = result.hasMore;
            $scope.loading = false;
            $scope.page += 1;
          });
      });
    };

    $scope.getTopSellersPaged();
  }

  angular.module('app.controllers')
  .controller('TopSellersController', TopSellersController);

}());

(function() {
  'use strict';

  TopCategoriesController.$inject = ['$scope', 'CategoryService'];
  function TopCategoriesController ($scope, CategoryService) {
    'ngInject';

      $scope.text = 'Category home view';

      $scope.init= function(){
        CategoryService.getSubcategoryList().then(function (response){
              $scope.categories = response;
              }
          );
      };

      $scope.init();
  }

  angular.module('app.controllers')
  .controller('TopCategoriesController', TopCategoriesController);

}());

(function() {
  'use strict';

  SearchController.$inject = ['$auth', '$cookies', '$location', '$timeout', '$rootScope', '$scope', '$state', '$stateParams', '$uibModal', 'CategoryService', 'InstanceModal', 'LocationService', 'NegotiationFactory', 'SearchModelFactory', 'screenSize', 'SmartBanner', 'UtilsService'];
  function SearchController (
    $auth,
    $cookies,
    $location,
    $timeout,
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $uibModal,
    CategoryService,
    InstanceModal,
    LocationService,
    NegotiationFactory,
    SearchModelFactory,
    screenSize,
    SmartBanner,
    UtilsService
  ) {
    'ngInject';

    // scope vars
    $scope.offersCount = 0;
    /**
     * Utils variables
     */
    // $rootScope.isScrolled = false;
    $scope.apiToken = appConfig.mapboxApiToken;
    $scope.isMobileNavActive = false;
    $scope.isSuggestionsDisplayed = false;
    $scope.homeRoot = $state;
    $scope.cityUrl = $state.locationId;
    $scope.vivaIconUrl = '/home/houston-tx';
    /**
     * Search text
     * @type {string}
     */
    $scope.util = {};
    $scope.searchText = "";
    $scope.util.searchLocationText = "";
    $scope.userName = '';
    $scope.imagePicture = '';
    $scope.isLogoutSelectedBt = false;
    /**
     * Category stuff
     * @type {Array}
     */
    $scope.categoryList = [];
    $scope.categoryId = null;
    $scope.listEnabled = false;
    $scope.categoriesButtonText = 'Categoría';
    $scope.isCategoriesActive = false;
    /**
     * The default location
     * Locations Stuff, name in the form City, State
     * and LocationId as city-state ej. san_francisco-california
     * @type {string}
     * @type {{locationId: string, canonical_name: string, latitude: number, longitude: number}}
     */
    $scope.location = {
      locationId: '',
      canonical_name: '',
      latitude: 29.7399453,
      longitude: -95.3987408
    };
    var mainMarker = {
      lat: $scope.location.latitude,
      lng: $scope.location.longitude,
      focus: true,
      // message: "Puedes arrastrar la marca para seleccionar un lugar",
      draggable: true,
      tap: false
    };
    angular.extend($scope, {
      center: {
        lat: $scope.location.latitude,
        lng: $scope.location.longitude,
        zoom: 13
      },
      markers: {
        mainMarker: mainMarker
      },
      position: {
        lat: $scope.location.latitude,
        lng: $scope.location.longitude
      },
      events: {
        markers: {
          enable: ['dragend']
        }
      }
    });
    $scope.modalHeight = "299px";

    // scope functions declaration
    $scope.showUserData = showUserData;
    $scope.setCategory = setCategory;
    $scope.displayCategoriesOnSpan = displayCategoriesOnSpan;
    $scope.safeApply = safeApply;
    $scope.hideLocationModal = hideLocationModal;
    $scope.onSearchTextChanged = onSearchTextChanged;
    $scope.onSearchTextOnclick = onSearchTextOnclick;
    $scope.clearKeyword = clearKeyword;
    $scope.onBlurSearchText = onBlurSearchText;
    $scope.setMobileNavigation = setMobileNavigation;
    $scope.changeModalHeight = changeModalHeight;
    $scope.updateLocation = updateLocation;
    $scope.showLoginForm = showLoginForm;
    $scope.openMapModal = openMapModal;

    //scope events
    $scope.$on(NegotiationFactory.eventRecountBuyerOffers, recountOffers);
    $scope.$on(NegotiationFactory.eventRecountSellerOffers, recountOffers);
    $rootScope.$on('location.changeMap', eventLocationChangeMap);
    $rootScope.$on('location.changed', eventLocationChanged);
    $rootScope.$on('location.cancel', eventLocationCancel);
    $scope.$on('leafletDirectiveMarker.dragend', eventLeafletDirectiveMarkerDragend);
    $scope.$on('$stateChangeSuccess', searchControllerStateChangeSuccess);

    $(window).on('touchstart',function() {
      $scope.safeApply(function () {
        $scope.displayCategoriesOnSpan(false);
      })
    });

    if (UtilsService.isRunningOnMobile()) {
      $scope.shouldVisible = (!$state.is('negotiation') && !$state.is('negotiationItem'));

      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $scope.shouldVisible = (toState.name !== 'negotiation' && toState.name !== 'negotiationItem');
      });
    } else {
      $scope.shouldVisible = true;
    }

    CategoryService.all().then(function (resp) {
      $scope.categoryList = resp.data.categories;
    });

    screenSize.when('xs, sm', function () {
      $scope.visible = "hidden";
    });

    screenSize.when('md, lg', function () {
      $scope.visible = "show";
    });

    function eventLocationChangeMap (event, mapboxResponse) {
      syncLocationAndMapAndMarkers(mapboxResponse.latitude, mapboxResponse.longitude);
    }

    function recountOffers (ev, count1, count2) {
      $scope.offersCount = count1 + count2;
    }

    function showUserData () {
      if ($auth.isAuthenticated()) {
        $scope.userName = $auth.getPayload().username;
        $scope.imagePicture = $auth.getPayload().profilePicture;
        return true;
      }
      return false;
    }

    function setCategory (category) {
      $scope.categoryId = category.code || category.name;
      $scope.categoriesButtonText = category.name;
      changeStates($scope.searchText, $scope.categoryId, $scope.location.locationId);
    }

    function displayCategoriesOnSpan (click) {
      $scope.isCategoriesActive = click && !$scope.isCategoriesActive;
    }

    function safeApply(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    }

    function syncLocationAndMapAndMarkers (lat, lng) {
      $timeout(function () {
        $scope.center.lat = mainMarker.lat = lat;
        $scope.center.lng = mainMarker.lng = lng;
      }, 0);
    }

    function eventLocationChanged (event, newLocation) {
      $scope.location = {
        locationId: newLocation.id,
        canonical_name: newLocation.canonical_name,
        latitude: newLocation.latitude,
        longitude: newLocation.longitude
      };
      changeStates($scope.searchText, $scope.categoryId, $scope.location.locationId);
      $scope.hideLocationModal();
    }

    function eventLocationCancel () {
      $scope.hideLocationModal();
    }

    function hideLocationModal () {
      $('#locationModal').modal('hide');
    }

    function eventLeafletDirectiveMarkerDragend (e, args) {
      LocationService.getCityByLatLng(args.model.lat, args.model.lng)
        .then(function (city) {
          $scope.util.searchLocationText = city.canonical_name;
          $rootScope.$broadcast('searchNewLocation', $scope.util.searchLocationText);
        });
    }

    function onSearchTextChanged (event) {
      var inputText = event.target.value.trim();
      $scope.searchText = inputText;
      var keyCode = event.keyCode;
      if (keyCode === 13 && inputText.length > 0) {
        changeStates($scope.searchText, $scope.categoryId, $scope.location.locationId);
      }
    }

    function changeStates (keyword, categoryId, locationId) {
      if (categoryId) {
        if (keyword) {
          $state.go('search.keywordCategory', {
            keyword: keyword,
            locationId: locationId,
            categoryId: categoryId
          });
        } else {
          $state.go('searchCategory', {
            locationId: locationId,
            categoryId: categoryId
          });
        }
      } else {
        if (keyword) {
          $state.go('search.keyword', {
            keyword: keyword,
            locationId: locationId
          });
        } else {
          $state.go('homeLocation', {
            locationId: locationId
          });
        }
      }
    }

    function onSearchTextOnclick () {
      $scope.listEnabled = $scope.searchText.length === 0;
      $scope.isMobileNavActive = false;
      changeStates($scope.searchText, $scope.categoryId, $scope.location.locationId);
    }

    function clearKeyword () {
      if ($scope.searchText !== null || $scope.searchText !== '') {
        if ($state.is('search.keyword') || $state.is('byCategory.category')) {
          $scope.searchText = null;
          // this.onSearchByKeyword(null);
        } else {
          $scope.searchText = null;
        }
      }
    }

    function onBlurSearchText () {
      $timeout(function () {
        $scope.listEnabled = false;
      }, 200);
    }

    function setMobileNavigation () {
      $scope.isMobileNavActive = !$scope.isMobileNavActive;
    }

    function changeModalHeight () {
      $timeout(function () {
        $scope.modalHeight = "478px";
      }, 0);
    }

    function updateLocation () {
      LocationService.getCityById($cookies.get('user-location') || 'houston-tx')
        .then(function (city) {
          $scope.location.locationId = city.id;
          $scope.location.canonical_name = city.canonical_name;
          $scope.location.latitude = city.latitude;
          $scope.location.longitude = city.longitude;
          $scope.location.id = city.id;
          $scope.util.searchLocationText = city.canonical_name;
          syncLocationAndMapAndMarkers($scope.location.latitude, $scope.location.longitude);
          $scope.$broadcast('geolocation.update',$scope.location);
          $state.go('homeLocation', {
            locationId: city.id
          });
        });
    }

    function searchControllerStateChangeSuccess (event, toState, toParams, fromState, fromParams, current) {
        $scope.vivaIconUrl = '/home/' + UtilsService.$formatURLString( ($cookies.get('user-location') || 'houston-tx'));

        if (toParams.categoryId) {
          $scope.categoryId = toParams.categoryId;
          CategoryService.findByCode($scope.categoryId)
            .then(function (c) {
              $scope.categoriesButtonText = c.name;
            });
        } else {
          $scope.categoriesButtonText = 'Categoría';
          $scope.categoryId = null;
        }

        var location = toParams.locationId;

        if (!fromParams.locationId && !toParams.locationId) {
          location = $cookies.get('user-location') || 'houston-tx';
        } else if (fromParams.locationId && !toParams.locationId) {
          location = fromParams.locationId;
        }

        LocationService.getCityById(location)
          .then(function (city) {
            $scope.location.locationId = city.id;
            $scope.location.canonical_name = city.canonical_name;
            $scope.location.latitude = city.latitude;
            $scope.location.longitude = city.longitude;
            $scope.util.searchLocationText = city.canonical_name;
            syncLocationAndMapAndMarkers($scope.location.latitude, $scope.location.longitude);
          });

        if (toParams.keyword) {
          $scope.searchText = toParams.keyword;
        } else {
          $scope.searchText = '';
        }
    }

    // REFACT: refact this method to create login form directive with modal ui-bootstrap

    function showLoginForm (displayTitleMessage) {
      $scope.displayTitleMessage = displayTitleMessage;
      InstanceModal.loginModal({
        resolve: {
          DisplayTitleMessage: function () {
            return true;
          }
        }
      });
    }

    function openMapModal() {
      $('#locationModal').on('shown.bs.modal', function () {
        if (UtilsService.isRunningOnMobile() && SmartBanner.isVisible()) {
          SmartBanner.hideBanner();
          bannerWasVisible = true;
        }
      });

      $('#locationModal').on('hidden.bs.modal', function () {
        if (UtilsService.isRunningOnMobile() && bannerWasVisible) {
          SmartBanner.showBanner();
          bannerWasVisible = false;
        }
      });
      $('#locationModal').modal('show');
      $scope.changeModalHeight();
    };
    var bannerWasVisible = false;
  }

  angular.module('app.controllers')
  .controller('SearchController', SearchController);

}());

(function() {
  'use strict';

  SearchByKeywordController.$inject = ['$scope', '$rootScope', '$stateParams', 'AdsItemService', '$location', '$window', '$state', 'UtilsService', 'SearchModelFactory', 'capitalizeFilter', 'CategoryService', '$q', 'locationResponse', 'itemsFounded', 'InstanceModal'];
  function SearchByKeywordController ($scope, $rootScope, $stateParams, AdsItemService, $location, $window, $state, UtilsService, SearchModelFactory, capitalizeFilter, CategoryService, $q, locationResponse, itemsFounded, InstanceModal) {

    'ngInject';

    $window.scrollTo(0, 0);
    $scope.itemList = [];
    $scope.page = 0;
    $scope.hasMore = false;
    $scope.loading = true;
    $scope.keyword = $stateParams.keyword;
    $scope.categoryId = $stateParams.categoryId;
    $scope.categoryName = $stateParams.categoryId ?
      CategoryService
      .findByCode($stateParams.categoryId)
      .then(function (c) {
        return c.name;
      }) : $q.when('Home Page');

    $scope.pageSize = 10;
    $scope.city_canonical_name = '';

    var getMDPromise = function () {
      return $scope.categoryName
        .then(function (catName) {
          var meta = {};
          if ($scope.itemList.length > 0) {
            meta['robots'] = 'index, follow';
          } else {
            meta['robots'] = 'follow, noindex';
          }
          // meta['canonical'] = 'http://www.close5.com/';
          if ($scope.hasMore) {
            meta['hasPaginationNext'] = true;
            meta['next'] = $location.path() + "?page=" + ($scope.page + 1);
          }
          if ($scope.page > 1) {
            meta['hasPaginationPrev'] = true;
            meta['prev'] = $location.path() + "?page=" + ($scope.page - 1);
          }
          meta['title'] = CategoryService.seoTags[catName].title.replace(/#location#/g, $scope.city_canonical_name);
          meta['metaTitle'] = CategoryService.seoTags[catName].metaTitle.replace(/#location#/g, $scope.city_canonical_name);
          // meta['h1'] = CategoryService.seoTags[catName].metaTitle.replace(/#location#/g', $scope.city_canonical_name);
          meta['keywords'] = CategoryService.seoTags[catName].metaKeywords.replace(/#location#/g, $scope.city_canonical_name);
          meta['description'] = CategoryService.seoTags[catName].metaDescription.replace(/#location#/g, $scope.city_canonical_name);
          return meta;
        });
    };

    function init () {

      if (locationResponse) {
        $scope.city_canonical_name = locationResponse.canonical_name;
      }

      if (itemsFounded) {
        setMoreItems(itemsFounded.data);
      }

    }

    function setMoreItems (newItems) {
      $scope.count = newItems.totalElements;
      $scope.itemList = $scope.itemList.concat(newItems.items);
      UtilsService.getItemsUrl($scope.itemList);
      var totalItems = newItems.totalElements;
      $scope.loading = false;
      if ($scope.pageSize * ($scope.page + 1) < totalItems) {
        $scope.hasMore = true;
      } else {
        $scope.hasMore = false;
      }
      $rootScope.$emit('newMetaDataPromise', UtilsService.newMetadataPromise($scope.metadata, getMDPromise()));
      $scope.page = $scope.page + 1;
    }

    $scope.loadItems = function () {

      if ($scope.hasMore) {

        if (!locationResponse) {
          LocationService.getCityById($stateParams.locationId)
          .then(function(location) {
            var requestOption = {
              categoryId: CategoryService.codesToIds[$stateParams.categoryId],
              page: $scope.page,
              pageSize: 10,
              latitude: location.latitude,
              longitude: location.longitude,
              radius: 20,
              order: 'published,nearest'
            };
            AdsItemService.searchPublic(requestOption)
            .then(function(itemsFounded) {
              setMoreItems(itemsFounded.data);
            });
          });
        } else {
          var requestOption = {
              categoryId: CategoryService.codesToIds[$stateParams.categoryId],
              page: $scope.page,
              pageSize: 10,
              latitude: locationResponse.latitude,
              longitude: locationResponse.longitude,
              radius: 20,
              order: 'published,nearest'
            };
          AdsItemService.searchPublic(requestOption)
          .then(function(itemsFounded) {
            setMoreItems(itemsFounded.data);
          });
        }
      }

    };

    $scope.likeToggle = function (item) {
      if ($scope.isAuthenticated()) {
        AdsItemService.toggleLikeItem(item.id, !item.followedByUser).then(function () {
          item.followedByUser = !item.followedByUser;
          item.totalOfFollowers = item.followedByUser ?
            item.totalOfFollowers + 1 :
            item.totalOfFollowers - 1;
        });
      } else {
        InstanceModal.loginModal({
  resolve: {
    DisplayTitleMessage: function () {
      return false;
    }
  }
});
      }
    };

    init();
  }

  angular.module('app.controllers')
  .controller('SearchByKeywordController', SearchByKeywordController);

}());

(function() {
  'use strict';

  SearchByCategoryController.$inject = ['$scope', '$stateParams', '$state', '$location', '$window', 'UtilsService', 'AdsItemService', 'LocationService', 'SearchModelFactory', 'capitalizeFilter', 'CategoryService'];
  function SearchByCategoryController ($scope, $stateParams, $state, $location, $window, UtilsService, AdsItemService, LocationService, SearchModelFactory, capitalizeFilter,CategoryService) {
      'ngInject';

      $window.scrollTo(0, 0);
      $scope.category = $stateParams.category;
      $scope.page = 1;
      $scope.itemList = [];
      $scope.hasMore = false;

      var dataLayer = window.dataLayer = window.dataLayer || [];
      dataLayer.push({
        "p": {
          "t": "ResultsBrowse"
        }
      });

      var getMD = function () {
        var meta = {};
        if($scope.locMD.name === '' || $scope.locMD.name === 'USA') {
          meta['description'] = capitalizeFilter($stateParams.category) + ' en Estados Unidos | Viva';
          meta['hasAppIndexingLink'] = true;
          meta['appIndexingLink'] = 'viva://categories/' + $stateParams.category;
        } else {
          meta['description'] = capitalizeFilter($stateParams.category) + ' en ' + $scope.locMD.name + ' | Viva';
        }
        if($scope.itemList.length > 0){
          meta['robots'] = 'index, follow';
        } else {
          meta['robots'] = 'follow, noindex';
        }
        meta['canonical'] = 'http://www.vivanuncios.com/';
        if ($scope.hasMore) {
          meta['hasPaginationNext'] = true;
          meta['next'] = $location.path() + "?page=" + ($scope.page + 1);
        }
        if ($scope.page > 1) {
          meta['hasPaginationPrev'] = true;
          meta['prev'] = $location.path() + "?page=" + ($scope.page - 1);
        }
        if($scope.locMD.name === '' || $scope.locMD.name === 'USA'){
          meta['title'] = capitalizeFilter($stateParams.category) + ' en Estados Unidos | Viva';
          meta['h1'] = capitalizeFilter($stateParams.category) + ' en Estados Unidos';
        } else {
          meta['title'] = capitalizeFilter($stateParams.category) + ' en ' + $scope.locMD.name + ' | Viva';
          meta['h1'] = capitalizeFilter($stateParams.category) + ' en venta en ' + $scope.locMD.name;
        }
        return meta;
      };

      var isWholeUsa = (!$stateParams.locationId);
      var resultCategory = CategoryService.getCategoryBreadcrumbName($stateParams.category);
      if($stateParams.category == 'allcategories'){
        SearchModelFactory.updateBreadcrumb($scope, 'All Categories', isWholeUsa);
      } else {
        resultCategory.then(function(category) {
          SearchModelFactory.updateBreadcrumb($scope, category.name, isWholeUsa);
        });
      }

      $scope.loadItems = function () {

        var loc = SearchModelFactory.getLocation(isWholeUsa);
        $scope.locMD = loc;

        if(isWholeUsa){
          loc.latitude = 0;
          loc.longitude = 0;
        }
        $scope.lsPromise = LocationService.getCoodsLocation(loc.latitude, loc.longitude);
        if (isWholeUsa) {
          LocationService.getCoodsLocationUSA.then(function (responseLocation) {
            var dataLayer = window.dataLayer = window.dataLayer || [];
            var ll = responseLocation[0].context.reverse();
            dataLayer.push({
              "l": {
                "l1": {
                  "id": ll[0].id,
                  "n": ll[0].text
                },
                "c": {
                  "id": ll[0].id,
                  "n": ll[0].text
                }
              }
            });
          });
        } else {
          $scope.lsPromise.then(function (responseLocation) {
            var dataLayer = window.dataLayer = window.dataLayer || [];
            var ll = responseLocation[0].context.reverse();
            dataLayer.push({
              "l": {
                "l1": {
                  "id": ll[0].id,
                  "n": ll[0].text
                },
                "l2": {
                  "id": ll[1].id,
                  "n": ll[1].text
                },
                "c": {
                  "id": responseLocation[0].id,
                  "n": responseLocation[0].place_name
                },
                "pcid": ll[2].text
              }
            });
          });
        }

        AdsItemService.getByCategory($scope.page, $scope.category, loc.latitude, loc.longitude).then(function (response) {
          $scope.itemList = $scope.itemList.concat(response.rows);
          UtilsService.getItemsUrl($scope.itemList);
          $scope.page += 1;
          $scope.count = response.count;
          $scope.hasMore = response.hasMore;

          $scope.$emit('newMetaData', UtilsService.newMetadata($scope.metadata, getMD()));
        });

      };

      CategoryService.getCategoryById($stateParams.category).then(function (c) {
        var dataLayer = window.dataLayer = window.dataLayer || [];
        dataLayer.push({
          "c": {
            "l1": {
              "id": c.id,
              "n": c.name
            }
          }
        });
      });

      $scope.loadItems();
  }

  angular.module('app.controllers')
  .controller('SearchByCategoryController', SearchByCategoryController);

}());

(function  () {
  'use strict';

  RejectOfferNegotiationController.$inject = ['$scope', '$uibModalInstance'];
  function RejectOfferNegotiationController ($scope, $uibModalInstance) {
    'ngInject';

    $scope.reason = '';
    $scope.confirm = confirm;

    function confirm (flag) {
      $uibModalInstance.close({
        flag: flag,
        reason: $scope.reason
      });
    }
  }

  angular.module('app.controllers')
  .controller('RejectOfferNegotiationController', RejectOfferNegotiationController);
}());

(function() {
  'use strict';

  PasswordResetController.$inject = ['$scope', '$stateParams', '$location', 'SendPassLinkService'];
  function PasswordResetController ($scope, $stateParams, $location, SendPassLinkService) {
      'ngInject';

      $scope.currentPass;
      $scope.newPass;
      $scope.newPassVerify;

      $scope.validpassword = true;

      $scope.checkpassword = function () {

        $scope.validpassword = ($scope.newPass == $scope.newPassVerify);

      };

      $scope.submit = function () {
        var id = $stateParams.id;
        SendPassLinkService.resetPasswordAPI(id, $scope.newPass)
        .then(
          function (response) {
            if (response.ok) {
              $location.path('/password-success');
            } else {
              $scope.error = true;
            }
          },
          function errorCallback(response) {
            console.log(response.error);
          }
        );
    };
  }

  angular.module('app.controllers')
  .controller('PasswordResetController', PasswordResetController);

}());

(function() {
  'use strict';

  PasswordForgotController.$inject = ['$scope', '$http', 'SendPassLinkService'];
  function PasswordForgotController ($scope, $http, SendPassLinkService) {
    'ngInject';

    $scope.email = "";

    $scope.sendEmail = function (email) {
      SendPassLinkService.sendResetPasswordLink(email).then(function (results) {
          if (results.ok) {
            $scope.sent = true;
            $scope.error = false;
          } else {
            $scope.error = true;
            $scope.sent = false;
          }
        }
      );
    };
  }

  angular.module('app.controllers')
.controller('PasswordForgotController', PasswordForgotController);

}());

(function() {
  'use strict';

  OurFavoritesController.$inject = ['$scope', 'AdsItemService', 'SearchModelFactory', '$stateParams', 'LocationService'];
  function OurFavoritesController ($scope, AdsItemService, SearchModelFactory, $stateParams, LocationService) {
    'ngInject';
    $scope.ourFavoritesList = [];
    $scope.ourFavoritesPaged = [];
    $scope.loading = true;
    $scope.page = 1;
    $scope.imgPathUrl = appConfig.imgUrlTemplate;
    $scope.hasMoreFavorites = false;

    $scope.getOurFavoritesFiltered = function () {
      LocationService.getCityById($stateParams.locationId).then(function (city) {
        AdsItemService.getOurFavorites(city.latitude, city.longitude, $scope.page)
        .then(function (result) {
            $scope.ourFavoritesList = $scope.ourFavoritesList.concat(result.rows);
            if (result.hasMore) {
              $scope.hasMoreFavorites = true;
              $scope.page += 1;
              $scope.loading = false;
            } else {
              $scope.hasMoreFavorites = false;
            }
        });
      });
    };

    $scope.theresOurFavoritesItems = function(count){
        var nCount = (typeof count !== 'undefined')? count : 1;
        return ($scope.ourFavoritesList.length >= nCount)
    };


    $scope.getOurFavoritesFiltered();

  }

  angular.module('app.controllers')
  .controller('OurFavoritesController', OurFavoritesController);

}());

(function() {
  'use strict;'

  NoResultsController.$inject = ['$scope', '$state', '$stateParams', '$window', '$timeout', 'SearchModelFactory', 'LocationService', 'CategoryService'];
  function NoResultsController ($scope, $state, $stateParams, $window, $timeout, SearchModelFactory, LocationService, CategoryService) {

    'ngInject';

    $window.scrollTo(0, 0);
    $scope.searchData = SearchModelFactory.location;
    $scope.categoryId = $stateParams.categoryId;
    $scope.keyword = $stateParams.keyword;
    $scope.categoryName = '';
    $scope.no_results_keyword = '';

    angular.element(document).ready(function () {

      $timeout(function () {

        $scope.isReady = true;

      }, 3000);

    });

    $scope.getNoResultValue = function () {
      CategoryService.findByCode($scope.categoryId).then(function (response) {
        $scope.categoryName = response.name;
        $scope.no_results_keyword = $scope.keyword != undefined ? $scope.keyword: $scope.categoryName;
      });
    };

    $scope.getNoResultValue();
  }

  angular.module('app.controllers')
  .controller('NoResultsController', NoResultsController);

}());

(function() {
  'use strict';

  NegotiationsListController.$inject = ['$scope', 'conversationsSeller', 'conversationsBuyer', 'NegotiationFactory', '$rootScope', '$timeout'];
  function NegotiationsListController ($scope, conversationsSeller, conversationsBuyer, NegotiationFactory, $rootScope, $timeout) {
    'ngInject';

    var pageBuyer = 1;
    var pageSeller = 1;

    $scope.offersBuyer = conversationsBuyer;
    $scope.offersSeller = conversationsSeller;
    $scope.showTab = showTab;
    $scope.scrollOptions = {seller : false, buyer: true};

    var deregistrationEvent = $rootScope.$on('$stateChangeStart', markAsSeen);
    $scope.getMoreConversationsSeller = getMoreConversationsSeller;
    $scope.getMoreConversationsBuyer = getMoreConversationsBuyer;
    // $scope.$on(NegotiationFactory.eventRecountBuyerOffers, refreshBuyerList);
    // $scope.$on(NegotiationFactory.eventRecountSellerOffers, refreshSellerList);

    function showTab (tab) {
      if (tab === 'seller') {
        $('#buyer').removeClass('active');
        $('#buyer-tab').removeClass('active');
        $scope.scrollOptions.buyer = true;
        $scope.scrollOptions.seller = false;
        if ($scope.offersBuyer.length) {
          var lastChat = getLastChat($scope.offersBuyer.offersBuyerArray)[0].lastChat;
          NegotiationFactory.seenNewChatsBuyer(lastChat.postTime);
        }
      } else {
        $('#seller').removeClass('active');
        $('#seller-tab').removeClass('active');
        $scope.scrollOptions.buyer = false;
        $scope.scrollOptions.seller = true;
        if ($scope.offersSeller.length) {
          var lastChat = getLastChat($scope.offersSeller.offersSellerArray)[0].lastChat;
          NegotiationFactory.seenNewChatsSeller(lastChat.postTime);
        }
      }

      $('#'+tab).addClass('active');
      $('#'+tab+'-tab').addClass('active');
    }

    function getLastChat (listConversations) {
      var listSorter = listConversations.sort(function(a,b) {
        if (!a.lastChat || !b.lastChat) {
          return 0;
        }
        return (-1) * (parseInt(a.lastChat.postTime) - parseInt(b.lastChat.postTime))
      });
      var offerSorted = [];
      listSorter.forEach(function(val) {
        if (val.lastChat) {
          offerSorted.push(val);
        }
      });
      return offerSorted;
    }

    function getMoreConversationsSeller () {
      $scope.scrollOptions.seller = true;
      if ($scope.offersSeller.hasMoreResults) {
        NegotiationFactory.getOffersSeller({page: pageSeller++, pageSize: 24, count: $scope.offersSeller.offersSellerArray.length}, false)
          .then(function(listConversations) {
            $scope.offersSeller.hasMoreResults = listConversations.hasMoreResults;
            $scope.offersSeller.offersSellerArray = $scope.offersSeller.offersSellerArray.concat(listConversations.offersSellerArray);
            $scope.scrollOptions.seller = false;
          });
      }
    }

    function getMoreConversationsBuyer () {
      $scope.scrollOptions.buyer = true;
      if ($scope.offersBuyer.hasMoreResults) {
        NegotiationFactory.getOffersBuyer({page: pageBuyer++, pageSize: 24, count: $scope.offersBuyer.offersBuyerArray.length}, false)
          .then(function  (listConversations) {
            $scope.offersBuyer.hasMoreResults = listConversations.hasMoreResults;
            $scope.scrollOptions.buyer = false;
            $scope.offersBuyer.offersBuyerArray = $scope.offersBuyer.offersBuyerArray.concat(listConversations.offersBuyerArray);
          });
      }
    }

    // function refreshSellerList () {
    //   $scope.offersSeller = $scope.listConversations.offersSellerArray;
    // }

    // function refreshBuyerList () {
    //   $scope.offersBuyer = $scope.listConversations.offersBuyerArray;
    // }

    function markAsSeen () {
      if ($('#buyer.active').length) {
        var lastChat = getLastChat($scope.offersBuyer.offersBuyerArray)[0].lastChat;
        NegotiationFactory.seenNewChatsBuyer(+lastChat.postTime+1000);
      } else {
        var lastChat = getLastChat($scope.offersSeller.offersSellerArray)[0].lastChat;
        NegotiationFactory.seenNewChatsSeller(+lastChat.postTime+1000);
      }
      deregistrationEvent();
    }

  }


  angular.module('app.controllers')
  .controller('NegotiationsListController',NegotiationsListController);
}());

(function() {
  'use strict';

  NegotiationsListItemController.$inject = ['$scope', 'ListConversations', 'NegotiationFactory', '$rootScope', '$timeout', 'IdItem'];
  function NegotiationsListItemController ($scope, ListConversations, NegotiationFactory, $rootScope, $timeout, IdItem) {
    'ngInject';

    $scope.listConversations = ListConversations;
    $scope.offersBuyer = sortOffers(ListConversations);

    // var deregistrationEvent = $rootScope.$on('$stateChangeStart', markAsSeen);
    $scope.$on(NegotiationFactory.eventRecountBuyerOffers, refreshBuyerList);


    function sortOffers(hashOffer) {
      var keysSorted = Object.keys(hashOffer).sort(function(a,b) {
        if (!hashOffer[a].lastChat || !hashOffer[b].lastChat) {
          return 0;
        }
        return (-1) * (parseInt(hashOffer[a].lastChat.postTime) - parseInt(hashOffer[b].lastChat.postTime))
      });
      var offerSorted = [];
      keysSorted.forEach(function(key) {
        if (hashOffer[key].lastChat) {
          offerSorted.push(hashOffer[key]);
        }
      });
      return offerSorted;
    }

    function refreshBuyerList () {
      $scope.offersBuyer = sortOffers(ListConversations);
    }

    // function markAsSeen () {
    //   NegotiationFactory.seenNewChatsBuyer(+$scope.offersBuyer[0].lastChat.postTime+1000);
    //   deregistrationEvent();
    // }

  }


  angular.module('app.controllers')
  .controller('NegotiationsListItemController',NegotiationsListItemController);
}());

(function() {
  'use strict';

  NegotiationController.$inject = ['$scope', 'Conversation', 'Chats', 'Item', '$uibModal', 'NegotiationService', '$timeout', 'AdsItemService', 'NegotiationFactory', '$state', '$auth', 'UtilsService'];
  function NegotiationController ($scope, Conversation, Chats, Item, $uibModal, NegotiationService, $timeout, AdsItemService, NegotiationFactory, $state, $auth, UtilsService) {
    'ngInject';

    $scope.myConversation = {};
    $scope.myConversation.status = {};
    $scope.myConversation.hashChats = Chats;
    $scope.myConversation.conversation = Conversation;
    $scope.item = Item.data;
    $scope.itemPrice = parseFloat($scope.item.price);
    $scope.makeOffer = makeOffer;
    $scope.sellerHasOffer = false;
    $scope.isSold = AdsItemService.isSold($scope.item.status);
    $scope.phrase = NegotiationService.isAccepted($scope.myConversation.conversation.status)
      ? 'Cerrado en'
      : 'Publicado en';
    $scope.itemImageStyle = {
      'background': 'url("' + $scope.item.pictures[0] +'")',
      'background-position': '50% 50%',
      'background-repeat': 'no-repeat',
      'background-size': 'cover'
    };

    $scope.$on('VIVA.chatNegotiation.sendChat', sendChat);
    $scope.$on('VIVA.chatNegotiation.cancelNegotiation', cancelNegotiationEvent);
    $scope.$on('$stateChangeStart', cancelNegotiationSearching);

    $scope.$watch('myConversation.conversation', conversationWatcher);

    var newChatsListener = null;
    var blockChatLister = false;
    var wasAcceptedRequest = false;
    var lastOfferTime = 0;

    $scope.acceptOffer = acceptOffer;
    $scope.rejectOffer = rejectOffer;
    $scope.openItem = openItem;

    if (Conversation.conversationId) {
      initConversationVar();
    } else {
      $scope.myConversation.status.isRejected = false;
      $scope.myConversation.status.isAccepted = false;
      $scope.myConversation.conversation.hasOffer = false;
      $scope.isSeller = $auth.getPayload().username.toLowerCase() !== $scope.item.user.username.toLowerCase();
    }

    function initConversationVar () {
      $scope.myConversation.status.isRejected = isRejected();
      $scope.myConversation.status.isAccepted = isAccepted();
      $scope.isSeller = NegotiationService.isSeller($scope.myConversation.conversation.role);
      newChatsListener = $timeout(getNewChats, 10000)

      // if (NegotiationService.isBuyer($scope.myConversation.conversation.role)) {
        Conversation.chats.forEach(function(chat) {
            validateOffer(chat);
            validateOfferAccepted(chat);
        });
      // }
    }

    function setChats (chats, addChatsFunction) {
      NegotiationFactory.getHashChats({
        chats: chats,
        username: $scope.myConversation.conversation.username,
        role: $scope.myConversation.conversation.role,
        userId:$scope.myConversation.conversation.userId,
        buyerThumbnail:$scope.myConversation.conversation.buyerThumbnail,
        sellerThumbnail:$scope.myConversation.conversation.sellerThumbnail,
        conversationId:$scope.myConversation.conversation.conversationId
      }, function(chat, chatObj) {
        validateOffer(chat);
        validateOfferAccepted(chat);
        $scope.myConversation.hashChats[chat.chatId] = chatObj;
        $scope.$broadcast('VIVA.chatNegotiation.appendChat', chat.chatId);
        $scope.$emit('VIVA.chatNegotiation.shouldShowCancelAction', !$scope.myConversation.status.isRejected || $scope.myConversation.conversation.conversationId);
      });
    }

    function sendChat (event ,comment) {
      if (comment.length) {
        var d = new Date();
        var promise = NegotiationService
        .sendChat({
          itemId: $scope.item.id,
          comment: comment,
          conversationId: $scope.myConversation.conversation.conversationId
        })
        .then(function (resp) {
          $scope.myConversation.conversation.conversationId = resp.conversationId;
          if (newChatsListener === null || $timeout.cancel(newChatsListener)) {
            getNewChats();
            $scope.$broadcast('VIVA.chatNegotiation.cleanInputBox');
          }
        })
        .catch(function(error) {
          if (error.errorCode === 701) {
            $state.go('error.productNotFound');
          }
        });
        $scope.$broadcast('VIVA.spinner.pushLoadingServiceNegotiation', promise);
      }
    }

    function getNewChats (conversationId) {
      return NegotiationService
      .getConversation(conversationId || $scope.myConversation.conversation.conversationId)
      .then(function(resp) {
        $scope.myConversation.conversation = resp;
        pushNewChats(resp.chats)
        if (!blockChatLister) {
          newChatsListener = $timeout(getNewChats, 10000);
        }
        return AdsItemService.find($scope.item.id);
      })
      .then(function (resp) {
        $scope.item = resp.data;
        $scope.isSold = AdsItemService.isSold($scope.item.status);
      })
      .catch(function(error) {
        if (error.errorCode === 703) {
          $state.go('error.productNotFound');
        }
      });
    }

    function pushNewChats (chats) {
      var newChats = [];
      var saveChat = null;
      angular.forEach(chats, function(chat, index) {
        if (!$scope.myConversation.hashChats[chat.chatId]) {
          if (NegotiationService.isAccepted(chat.action)) {
            saveChat = chat;
          } else {
            newChats.push(chat);
          }
          if (wasAcceptedRequest) {
            // saveChat = chat;
            wasAcceptedRequest = false;
          }
        }
      });
      if (saveChat) {
        newChats.push(saveChat);
      }
      if (newChats.length) {
        setChats(newChats);
      }
    }

    function makeOffer () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/viva-negotiation-make-offer.html',
        controller: 'MakeOfferNegotiationController',
        resolve: {
          conversation: function () {
            return $scope.myConversation.conversation;
          },
          item : function() {
            return $scope.item;
          },
          sellerHasOffer: function () {
            return $scope.sellerHasOffer;
          }
        },
        windowClass: 'modal-make-offer-negotiation'
      });

      modalInstance.result
      .then(function(offer) {
        var promise = NegotiationService
        .sendOffer({
          itemId: $scope.item.id,
          conversationId: $scope.myConversation.conversation.conversationId,
          offeredPrice: offer,
          brandPublish: 'web',
          versionPublish: '2'
        })
        .then(function(resp) {
          $scope.myConversation.conversation.conversationId = resp.conversationId;
          if (newChatsListener === null || $timeout.cancel(newChatsListener)) {
            getNewChats();
          }
        });
        $scope.$broadcast('VIVA.spinner.pushLoadingServiceNegotiation', promise);
      });
    }

    function acceptOffer () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/viva-negotiation-accept-offer.html',
        controller: 'AcceptOfferNegotiationController',
        resolve: {
          offer : function() {
            return NegotiationService.isBuyer($scope.myConversation.conversation.role)
                  ? $scope.myConversation.conversation.currentPriceProposedByBuyer || $scope.item.price
                  : $scope.myConversation.conversation.currentPriceProposedBySeller || $scope.item.price
          }
        },
        windowClass: 'modal-accept-offer-negotiation'
      });

      modalInstance.result
      .then(function (flag) {
        if (flag) {
          if ($scope.myConversation.conversation.chats && $scope.myConversation.conversation.chats.length ) {
            var promise = NegotiationService
            .acceptOffer({
              conversationId: $scope.myConversation.conversation.conversationId
            })
            .then(function(res) {
              if (newChatsListener === null || $timeout.cancel(newChatsListener)) {
                wasAcceptedRequest = true;
                getNewChats();
                $scope.phrase = 'Cerrado en';
              }
            });
            $scope.$broadcast('VIVA.spinner.pushLoadingServiceNegotiation', promise);
          } else {
            var promise = AdsItemService.sellItem($scope.item.id)
            .then(function(res) {
              return NegotiationService.getConversation(res.conversationId)
                    .then(function (resp) {
                        $scope.myConversation.conversation = resp;
                        NegotiationFactory.getHashChats(resp , function(chat, chatObj) {
                        $scope.myConversation.hashChats[chat.chatId] = chatObj;

                        $scope.$broadcast('VIVA.chatNegotiation.prependChat', chat.chatId);
                      });
                    });
            });
            $scope.$broadcast('VIVA.spinner.pushLoadingServiceNegotiation', promise);
          }
        }
      });
    }

    function rejectOffer () {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/viva-negotiation-reject-offer.html',
        controller: 'RejectOfferNegotiationController',
        resolve: {
          offer : function() {
            return NegotiationService.isBuyer($scope.myConversation.conversation.role)
                  ? $scope.myConversation.conversation.currentPriceProposedByBuyer
                  : $scope.myConversation.conversation.currentPriceProposedBySeller
          }
        },
        windowClass: 'modal-reject-offer-negotiation'
      });

      modalInstance.result
      .then(function (confirmation) {
        if (confirmation.flag) {
          var promise = NegotiationService
          .rejectOffer({
            conversationId: $scope.myConversation.conversation.conversationId,
            explanation: confirmation.reason
          })
          .then(function(res) {
            if (newChatsListener === null || $timeout.cancel(newChatsListener)) {
                getNewChats();
              }
          });
          $scope.$broadcast('VIVA.spinner.pushLoadingServiceNegotiation', promise);
        }
      });
    }

    function isRejected () {
      return NegotiationService.isRejected($scope.myConversation.conversation.status);
    }

    function isAccepted () {
      return NegotiationService.isAccepted($scope.myConversation.conversation.status);
    }

    function conversationWatcher (newV, oldV) {
      if (newV) {
        $scope.myConversation.status.isRejected = isRejected();
        $scope.myConversation.status.isAccepted = isAccepted();
        if ($scope.myConversation.status.isAccepted) {
          $scope.phrase = 'Cerrado en';
        }
        if ($scope.myConversation.status.isRejected || !$scope.myConversation.conversation.conversationId) {
          $scope.$emit('VIVA.chatNegotiation.shouldShowCancelAction', false);
        }
      }
    }

    function cancelNegotiationEvent (ev) {
      rejectOffer();
    }

    function validateOffer(chat) {

      if (NegotiationService.isOffer(chat.action) && lastOfferTime < chat.postTime) {
        $scope.phrase = 'Última oferta recibida:';
        $scope.itemPrice = chat.offeredPrice;
        lastOfferTime = parseInt(chat.postTime);
      }

      if (!$scope.sellerHasOffer) {
        $scope.sellerHasOffer = ($scope.myConversation.conversation.hasOffer
        && NegotiationService.isOpen($scope.myConversation.conversation.status)
        && NegotiationService.isOffer(chat.action)
        && chat.senderUsername === $scope.myConversation.conversation.username)
      }
      return $scope.sellerHasOffer;
    }

    function cancelNegotiationSearching () {
      if (newChatsListener) {
        if (!$timeout.cancel(newChatsListener)) {
          blockChatLister = true;
        }
      }
    }

    function validateOfferAccepted (chat) {
      if (NegotiationService.isAccepted(chat.action)) {
        $scope.itemPrice = chat.offeredPrice;
      }
    }

    function openItem () {
      $state.go('item', {itemCategory: $scope.item.category.name, itemName: $scope.item.name, itemId: $scope.item.id})
    }

  }

  angular.module('app.controllers')
  .controller('NegotiationController', NegotiationController);

}());

(function() {
  'use strict';

  NegotiationSubController.$inject = ['$scope'];
  function NegotiationSubController ($scope) {
    'ngInject'
  }

  angular.module('app.controllers')
  .controller('NegotiationSubController',NegotiationSubController);
}());

(function() {
  'use strict';

  ModalTopHeader.$inject = ['$scope', '$rootScope', '$state'];
  function ModalTopHeader ($scope, $rootScope, $state) {
    'ngInject';

    $scope.cancelNegotiation = cancelNegotiation;
    $scope.shouldVisible = $state.is('negotiation') || $state.is('negotiationItem');
    $scope.shouldShowCancelAction = true;

    $rootScope.$on('VIVA.chatNegotiation.shouldShowCancelAction', showCancelAction);

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $scope.shouldVisible = toState.name === 'negotiation' || toState.name === 'negotiationItem';
    });

    function cancelNegotiation () {
      $rootScope.$broadcast('VIVA.chatNegotiation.cancelNegotiation');
    }

    function showCancelAction (ev, flag) {
      $scope.shouldShowCancelAction = flag;
    }
  }

  angular.module('app.controllers')
  .controller('ModalTopHeader', ModalTopHeader);
}());

(function() {
  'use strict';

  ModalShareController.$inject = ['$scope', '$timeout', '$uibModalInstance', 'entity', 'url', 'type'];
  function ModalShareController ($scope, $timeout, $uibModalInstance, entity, url, type) {
    'ngInject';

    $scope.hasCopy = false;
    $scope.onSuccess = function (e) {
      $scope.hasCopy = true;
      $timeout(function () {
        $scope.hasCopy = false;
      }, 2000);
    };

    $scope.$on('modal.closing', function () {
      $scope.hasCopy = false;
    });

    $scope.closeModal = function () {
      $('.modal').modal('hide');
    };

    $scope.url = url;

    $scope.shareFacebook = function () {
      FB.ui({
        method: 'share',
        href: url
      }, function(response){
      });
    };
    var text = "";
    switch (type) {
      case 'app':
        text = 'Únete a la comunidad de anuncios clasificados. Baja la App Ahora!';
        break;
      case 'item':
        text ='Encontré esta oferta en Vivanuncios Estados Unidos!';
      case 'group':
        var entityName = entity.username || entity.name;
        text = 'Mira las ofertas que tiene publicadas ' + entityName +' en VivanunciosUSA!';
        break;
      default:
      text = "Únete a la comunidad de anuncios clasificados. Baja la App Ahora!";
    }

    $scope.twitterUrl =
      'https://twitter.com/intent/tweet?text=' + text + '&url=' +
      window.encodeURIComponent(url);

    if(typeof(entity) != "undefined") {

      // var clipboard = new Clipboard('a.link-logo');

      $scope.entity = entity;
      if (typeof(entity.pictureUrl) === "undefined") {
        if (typeof(entity.pictures) != "undefined") {
          $scope.entity.pictureUrl = entity.pictures[0];
        }
      }
    }
  }

  angular.module('app.controllers')
  .controller('ModalShareController', ModalShareController);

}());


(function() {
  'use strict';

  LoginFormController.$inject = ['$auth', '$scope', '$state', '$timeout', '$uibModalInstance', 'DisplayTitleMessage', 'LocationService', 'RecoverPasswordService', 'UtilsService'];
  function LoginFormController (
    $auth,
    $scope,
    $state,
    $timeout,
    $uibModalInstance,
    DisplayTitleMessage,
    LocationService,
    RecoverPasswordService,
    UtilsService
  ) {
    'ngInject';

    $scope.validUsername = true;
    $scope.validSubmit = false;
    $scope.loginFormDisplayed = false;
    $scope.headerFormDisplayed = false;
    $scope.registrationFormDisplayed = false;
    $scope.recoverPasswordFormDisplayed = false;
    $scope.recoverPwdSuccess = false;
    $scope.recoverPwdError = '';
    $scope.isLocationEmpty = false;
    $scope.validZipcode = false;
    $scope.disableInvalidZipCodeMessage = false;
    $scope.apiToken = appConfig.mapboxApiToken;
    $scope.username = '';
    $scope.password = '';
    $scope.user = {};
    $scope.user = {
      username : '',
      password : ''
    };
    $scope.minUsernameLength = 5;
    $scope.minPasswordLength = 6;
    $scope.signUpError = {};
    $scope.displayTitleMessage = DisplayTitleMessage;
    $scope.apiError = {};

    $scope.validateUsername =  validateUsername;
    $scope.runningOnMobile =  runningOnMobile;
    $scope.goToLegalTerms =  goToLegalTerms;
    $scope.loginEmail =  loginEmail;
    $scope.submitFacebook =  submitFacebook;
    $scope.signupSubmit =  signupSubmit;
    $scope.backToMainMenu =  backToMainMenu;
    $scope.showRecoverPasswordForm =  showRecoverPasswordForm;
    $scope.showLoginForm =  showLoginForm;
    $scope.showEmailRegistration =  showEmailRegistration;
    $scope.showEmailRegistrationView =  showEmailRegistrationView;
    $scope.recoverPasswordSubmit =  recoverPasswordSubmit;
    $scope.recoverpwdCb =  cb;
    $scope.signup = signup;
    $scope.login = login;
    $scope.recoverPassword = recoverPassword;
    $scope.closeModal = closeModal;

    $scope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams, options){
      $uibModalInstance.dismiss();
    });

    $scope.$watch('registrationForm.zipCode.$valid',
      function (validity) {
        if (validity) {
          if ($scope.registrationFormDisplayed) {
            LocationService.getCityByZipcode(registrationForm.zipCode.value)
            .then(function (data) {
              var locationData = data.features[0];
              if (locationData != undefined) {
                $scope.user.zipcode = registrationForm.zipCode.value;
                var lat = locationData.geometry.coordinates[1];
                var lng = locationData.geometry.coordinates[0];
                $scope.user.location = lat + ',' + lng;
                LocationService.getCityByLatLng(lat, lng)
                .then(function (city) {
                  $scope.user.locationName = city.canonical_name;
                  $scope.isLocationEmpty = false;
                });
                $scope.validZipcode = true;
                $scope.disableInvalidZipCodeMessage = false;
              } else {
                $scope.isLocationEmpty = true;
                $scope.disableInvalidZipCodeMessage = true;
              }
            });
          }
        } else {
          $scope.disableInvalidZipCodeMessage = false;
          $scope.isLocationEmpty = true;
          $scope.validZipcode = false;
        }
    });

    function closeModal() {
      $uibModalInstance.dismiss();
    }

    function signup (user) {
      $auth.signup(user)
        .then(function (response) {
          $auth.login({
            username: user.username,
            password: user.password
          }).then(function () {
            $uibModalInstance.dismiss();
          });

        })
        .catch(function (error) {
          $scope.apiError = error.data;
        });
    }

    function login (options) {
      var authPromise = options.provider === 'facebook' ? $auth.authenticate('facebook') : $auth.login(options.credentials);
      return authPromise
        .then(function () {
          $scope.error = '';
          $uibModalInstance.dismiss();
          $state.reload();
        })
        .catch(function (error) {
          var message = error.data.message;
          if (message === 'Nuevo usuario con facebook') {
            return error;
          } else {
            $scope.error = message;
          }
        });
    }

    function recoverPassword (email) {
      RecoverPasswordService.recoverPassword(email)
        .then(function successCallback(resp) {
          if (resp.statusCode === 1) {
            $scope.recoverpwdCb('', true, true);
          } else {
            $scope.recoverpwdCb(resp.statusMessage, false, true);
          }
        }, function errorCallback(error) {
          $scope.recoverpwdCb('Ocurrió un error al procesar tu solicitud, inténtalo más tarde', false, true);
        });
    }

    function validateUsername () {
      if (!$scope.username) {
        $scope.validSubmit = $scope.validUsername = false;
      } else {
        if ($scope.username.indexOf('@') > -1) {
          $scope.validSubmit = $scope.validUsername = /.+@.+\..+/i.test($scope.username);
        } else {
          $scope.validSubmit = $scope.validUsername = $scope.username !== '';
        }
      }
      $scope.validSubmit = $scope.validSubmit && $scope.password;
    }


    function runningOnMobile () {
      return UtilsService.isRunningOnMobile();
    }

    function goToLegalTerms() {
      $uibModalInstance.dismiss();
      $state.go('statics.legalDisclosures',{'#':'terms'});
    }

    function loginEmail () {
      var username = $scope.username;
      var password = $scope.password;
      if (username && password) {
        $scope.login({
          provider: 'login',
          credentials: {
            username: username,
            password: password
          }
        });
      }
    }

    function submitFacebook () {
      $scope.login({
        provider: 'facebook'
      }).then(function(data) {
        var message = data.data.message;
        if (message === 'Nuevo usuario con facebook') {
          $scope.showEmailRegistration({
            username: data.data.body.first_name + data.data.body.last_name,
            password: '',
            email: data.data.body.email,
            location: '',
            locationName: '',
            zipCode: '',
            fb_token: data.data.fb_token,
            fb_user_id: data.data.fb_user_id
          });
        }
      });
    }

    function signupSubmit () {
      if (typeof $scope.user.fb_token !== 'undefined' && $scope.user.fb_token.length > 0 &&
        typeof $scope.user.fb_user_id !== 'undefined' && $scope.user.fb_user_id.length > 0) {
      } else {
        delete $scope.user.fb_token;
        delete $scope.user.fb_user_id;
      }
      $scope.signup($scope.user);
    }

    function backToMainMenu () {
      $scope.loginFormDisplayed = false;
      $scope.headerFormDisplayed = false;
      $scope.registrationFormDisplayed = false;
      $scope.recoverPasswordFormDisplayed = false;
      $scope.validUsername = true;
      $scope.validSubmit = false;
      $scope.username = '';
      $scope.password = '';
      $scope.user = {};
      $scope.apiError.message = '';
      $scope.error = '';
    }

    function showRecoverPasswordForm () {
      $scope.recoverPasswordFormDisplayed = true;
      $scope.loginFormDisplayed = false;
    }

    function showLoginForm () {
      $scope.loginFormDisplayed = true;
      $scope.headerFormDisplayed = true;
      $scope.registrationFormDisplayed = false;
    }

    function showEmailRegistration (user) {
      $scope.showEmailRegistrationView();

      if (user.username.length > 15) {
        user.username = user.username.slice(0,15);
      }
      $scope.user = user;
    }

    function showEmailRegistrationView () {
      $scope.loginFormDisplayed = false;
      $scope.headerFormDisplayed = !$scope.headerFormDisplayed;
      $scope.registrationFormDisplayed = !$scope.registrationFormDisplayed;
    }

    function recoverPasswordSubmit () {
      $scope.recoverPassword({email: {email: $scope.recoverEmail}});
    }

    function cb (error, success, beVal) {
      $scope.recoverPwdError = error;
      $scope.recoverPwdSuccess = success;
      $scope.recoverPwdBEval = beVal;
    }

  }

  angular.module('app.directives')
  .controller('LoginFormController', LoginFormController);

}());

(function() {
  'use strict';

  MakeOfferNegotiationController.$inject = ['$scope', '$uibModalInstance', 'conversation', 'item', 'sellerHasOffer', '$filter', 'NegotiationService'];
  function MakeOfferNegotiationController ($scope, $uibModalInstance, conversation, item, sellerHasOffer, $filter, NegotiationService) {
    'ngInject';

    $scope.makeOffer = makeOffer;
    $scope.confirm = confirm;
    $scope.cancel = cancel;
    $scope.confirmOffer = false;
    $scope.conversation = conversation;
    $scope.offer = {};
    $scope.offer.price = '$' + parseFloat(NegotiationService.isBuyer($scope.conversation.role)
                        ? $scope.conversation.currentPriceProposedByBuyer  || item.price
                        : $scope.conversation.currentPriceProposedBySeller || item.price);
    // $scope.formMakeOffer.price.$setViewValue('$' + $scope.offer.price);
    $scope.isNumberKey = isNumberKey;

    var textOfferBuyer = $scope.conversation.username +' vende su producto a ' + $filter('vivaCurrency')($scope.conversation.currentPriceProposedByBuyer || item.price);
    var questionOfferBuyer = '¿Cuánto quieres ofertar por él?';
    var textOfferSeller = 'El producto está publicado a ' + $filter('vivaCurrency')($scope.conversation.currentPriceProposedBySeller || item.price);
    var questionOfferSeller = '¿A cuánto quieres ofertarlo?';
    var textImproveOfferSeller = 'La última oferta fue de ' +( parseFloat(NegotiationService.isBuyer($scope.conversation.role))
                            ? $filter('vivaCurrency')($scope.conversation.currentPriceProposedBySeller  || item.price)
                            : $filter('vivaCurrency')($scope.conversation.currentPriceProposedByBuyer || item.price));
    var questionImproveOfferSeller = '¿Quieres mejorarla?';
    var textCounterOffer = $scope.conversation.username + ' ofertó ' +
                                                          $scope.offer.price
                                                         + ' por el producto';
    var questionCounterOffer = '¿Cuánto quieres contraofertar por él?';

    if (!sellerHasOffer && $scope.conversation.hasOffer) {
      $scope.presentationText = textImproveOfferSeller;
      $scope.questionText = questionImproveOfferSeller;
      $scope.offer.price = '$' + parseFloat(NegotiationService.isBuyer($scope.conversation.role)
                        ? $scope.conversation.currentPriceProposedBySeller  || item.price
                        : $scope.conversation.currentPriceProposedByBuyer || item.price);
    } else {
      if (!$scope.conversation.hasOffer) {
        if (NegotiationService.isSeller($scope.conversation.role)) {
          $scope.presentationText = textOfferBuyer;
          $scope.questionText = questionOfferBuyer;
        } else {
          $scope.presentationText = textOfferSeller;
          $scope.questionText = questionOfferSeller;
        }
      } else {
          $scope.presentationText = textCounterOffer;
          $scope.questionText = questionCounterOffer;
      }
    }

    function makeOffer () {
      if (parseFloat($scope.offer.price) === 0 && parseFloat($scope.offer.price) < 1000000) {
        $('.error-message').addClass('active');
      } else {
        $('.error-message').removeClass('active');
        if ($scope.offer.price.indexOf('$')>= 0) {
          $scope.offer.price = $scope.offer.price.substr(1,$scope.offer.price.length);
        }
        $scope.confirmOffer = !$scope.confirmOffer;
      }
    }

    function cancel () {
      $uibModalInstance.dismiss('cancel');
    }

    function confirm(flag) {
      if (flag) {
        $uibModalInstance.close($scope.offer.price);
      } else {
        if ($scope.offer.price.indexOf('$') < 0) {
          $scope.offer.price = '$' + $scope.offer.price;
        }
        $scope.confirmOffer = !$scope.confirmOffer;
      }
    }

    function isNumberKey(evt) {
      var charCode = (evt.which) ? evt.which : event.keyCode;
      if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
          return false;

      return true;
    }

  }

  angular.module('app.controllers')
  .controller('MakeOfferNegotiationController', MakeOfferNegotiationController);

}());

(function() {
  'use strict';

  ItemSoldController.$inject = ['$scope', '$uibModalInstance'];
  function ItemSoldController ($scope, $uibModalInstance) {
    'ngInject';

    $scope.ok = ok;

    function ok () {
      $uibModalInstance.close();
    }
  }

  angular.module('app.controllers')
  .controller('ItemSoldController', ItemSoldController);
}());

(function() {
  'use strict';

  ItemDetailController.$inject = ['$rootScope', '$scope', '$stateParams', '$state', '$window', '$timeout', 'AdsItemService', 'LocationService', 'UtilsService', 'SearchModelFactory', 'CategoryService', '$q', 'BranchIoService', 'UserService', 'FollowUserService', '$auth', '$uibModal', 'InstanceModal'];
  function ItemDetailController ($rootScope, $scope, $stateParams, $state, $window, $timeout, AdsItemService, LocationService, UtilsService, SearchModelFactory, CategoryService, $q, BranchIoService, UserService, FollowUserService, $auth, $uibModal, InstanceModal) {

    'ngInject';

    var deferred = $q.defer();
    //$scope.imgPathUrl = appConfig.imgUrlTemplate;
    $scope.entityId = $stateParams.itemId;
    $scope.entity = {
      description: '',
      photoCount: 0
    };
    $scope.comments = {};
    $scope.map = {};
    $scope.map.showMap = false;
    $scope.runningOnMobile = false;
    $scope.activeImageIndex = 0;
    $scope.photoCount = 0;
    $scope.itemLocation = '';
    $scope.imageIndexList = [];
    $scope.otherItemList = [];
    $scope.userPromise = deferred.promise;
    $scope.descriptionForItem = '';
    $scope.isReady = false;
    $scope.loadingItem = true;
    $scope.loadingProfileItems = false;
    $scope.linkReady = false;
    $scope.userInfo = [];
    $scope.isCollapsed = true;
    $scope.followers = [];
    $scope.followings = [];
    $scope.tabModalFollowersFollowings = {};
    $scope.tabModalFollowersFollowings.active = '';
    $scope.isUserLogged = false;
    $scope.goChat = goChat;
    $scope.city = 'USA';

    //sliders variables
    $scope.slides = [];
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;

    var currIndex = 0;
    var circleRadioMeters = appConfig.mapSetting.redCircleRadioMiles * 1609.34;
    var draggingEnable = !UtilsService.isRunningOnMobile();

    $scope.isFollowed = FollowUserService.isFollowed;
    $scope.isLoggedUser = FollowUserService.isLoggedUser;
    $scope.toggleFollowUser = FollowUserService.toggleFollowUser;

    angular.extend($scope.map, {
      center: {
        lat: 0,
        lng: 0,
        zoom: appConfig.mapSetting.zoom
      },
      tiles: {
        name: '',
        url: 'https://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
        type: 'xyz',
        options: {
          apikey: appConfig.mapboxApiToken,
          mapid: 'mapbox.' + appConfig.mapSetting.style
        }
      },
      paths: {
        circle: {
          type: "circle",
          color: "red",
          weight: 0.5,
          radius: circleRadioMeters,
          latlngs: {
            lat: 0,
            lng: 0
          },
          clickable: false
        }
      },
      defaults: {
        scrollWheelZoom: false,
        dragging: draggingEnable,
        touchZoom: draggingEnable,
        doubleClickZoom: true,
        zoomControl: draggingEnable
      }
    });

    var x = {};

    $scope.followersPromise = function (username) {
        UserService.getFollowers(username, $auth.isAuthenticated())
          .then(function (resp) {
            var followers = resp.data.users;
            $scope.followers = followers;
          });
      };
      $scope.followingsPromise = function (username) {
        UserService.getFollowings(username, $auth.isAuthenticated())
          .then(function (resp) {
            var followings = resp.data.users;
            $scope.followings = followings;
          });
      };

    angular.extend($scope, {
      setActiveImageIndex: function (index) {
        $scope.imageIndexList = UtilsService.range(0, $scope.entity.pictures.length);
        var i = $scope.imageIndexList.indexOf(index);
        $scope.imageIndexList.splice(i, 1);
        $scope.activeImageIndex = index;
      },
      mustShowImageList: function (index) {
        return (this.imageIndexList.length >= 1);
      },
      mustShowComments: function (index) {
        return (this.comments.length > 1);
      },
      isLiked: function () {
        if ($scope.entity.followedByUser === undefined) {
          return false;
        }
        return ($scope.entity.followedByUser);
      },
      hasSocial: function (social) {
        var userSocials = $scope.userInfo.userSocials;
        if (userSocials === undefined) {
          return false;
        }
        return (userSocials.indexOf(social) !== -1);
      },

      isRunningOnMobile: UtilsService.isRunningOnMobile
    });

    $scope.init = function () {

      this.runningOnMobile = this.isRunningOnMobile();

      AdsItemService.find(this.entityId).then(function (item) {

        if (item.statusCode === 1) {
          $rootScope.$emit('newMetaData', UtilsService.newMetadata($scope.metadata, {
            'title': item.data.name + ' en ' + item.data.locationName + ' ' + item.data.zipCode + ' | Vivanuncios Estados Unidos',
            'canonical': 'http://www.vivanuncios.com/pr/' + UtilsService.$formatURLString(item.data.category.name) + '/' + UtilsService.$formatURLString(item.data.name) + '/' + item.data.id
          }));

          $scope.cbFollowUser = function () {
            UserService.getByUsername(item.data.user.username).then(function (userInfo) {
              $scope.userInfo = userInfo.data;
            });
          };

          $scope.imageIndexList = UtilsService.range(1, item.data.pictures.length);
          // Get Location
          LocationService.getCityByLatLng(item.data.latitude, item.data.longitude)
          .then(function (city) {
            $scope.map.showMap = true;
            $scope.map.center.lng = city.longitude;
            $scope.map.center.lat = city.latitude;
            $scope.map.paths.circle.latlngs.lat = city.latitude;
            $scope.map.paths.circle.latlngs.lng = city.longitude;
            $scope.itemLocation = city.canonical_name;
          })
          .catch(function (error) {
            LocationService.getCityByZipcode(item.data.zipCode)
            .then(function (city) {
              var feat = city.features[0];
              $scope.map.showMap = true;
              $scope.map.center.lng = feat.center[0];
              $scope.map.center.lat = feat.center[1];
              $scope.map.paths.circle.latlngs.lat = feat.center[1];
              $scope.map.paths.circle.latlngs.lng = feat.center[0];
              $scope.itemLocation = item.data.locationName;
            });
          });
          $scope.loadingItem = false;
          $scope.loadingProfileItems = true;

          var pageSize = $scope.isRunningOnMobile() ? 2 : 5;
          var requestOptions = {
            page: 0,
            pageSize: pageSize
          };
          var otherItemsPromise = AdsItemService.findByUser(item.data.user.username, requestOptions, item.data.id);
          otherItemsPromise.then(function (resultotherItemList) {
            $scope.otherItemList = resultotherItemList.data.items;
            UtilsService.getItemsUrl($scope.otherItemList);
            $scope.hasMore = resultotherItemList.data.totalPages > 1;
            $scope.loadingProfileItems = false;
          });
          if ($auth.getPayload()) {
            $scope.isUserLogged = $auth.getPayload().username === item.data.user.username;
          }
          $scope.userPromise = UserService
            .getByUsername(item.data.user.username);


          $scope.userPromise.then(function (userInfo) {
            $scope.userInfo = userInfo.data;
            $scope.followingsPromise(userInfo.data.username);
            $scope.followersPromise(userInfo.data.username);
            deferred.resolve(userInfo);
          });

          $scope.entity = item.data;
          $scope.photoCount = item.data.pictures.length;
          var i = 0;
          for (i; i < $scope.photoCount; i++) {
            $scope.addSlide(item.data.pictures[i]);
          }
        } else if (item.statusCode === 2 && item.errorCode === 724) {
          $state.go('error.userNotAuthorized');
        } else {
          $state.go('error.productNotFound');
        }
      });
    };

    $scope.fullName = function (firstName, lastInitial) {
      if ((!firstName) || (!lastInitial)) {
        return "";
      }
      return firstName + " " + lastInitial + ".";
    };


    //Slider functionality

    $scope.addSlide = function (url, index) {
      $scope.slides.push({
        image: url,
        id: currIndex++
      });
    };

    $scope.randomize = function () {
      var indexes = generateIndexesArray();
      assignNewIndexesToSlides(indexes);
    };

    $scope.likeToggle = function (item) {
      if ($scope.isAuthenticated()) {
        if (item.status === 'ACTIVE') {
          AdsItemService.toggleLikeItem(item.id, !item.followedByUser).then(function () {
            item.followedByUser = !item.followedByUser;
            item.totalOfFollowers = item.followedByUser ?
                item.totalOfFollowers + 1 :
                item.totalOfFollowers - 1;
          });
        }
      } else {
        InstanceModal.loginModal({
  resolve: {
    DisplayTitleMessage: function () {
      return false;
    }
  }
});
      }
    };

    $scope.$formatDate = function (strDate) {
      if (typeof strDate === 'undefined') {
        return "";
      }
      return moment.unix(strDate).format("MM/DD/YYYY");
    };

    $scope.formatPublishedDate = function () {
      return (moment().diff($scope.entity.published, 'days') <= 14) ?
          moment($scope.entity.published).fromNow() :
          moment($scope.entity.published).format('ll');
    };

    function goChat () {
      if ($scope.isAuthenticated()) {
        if (FollowUserService.isLoggedUser($scope.userInfo.username)) {
          $state.go('negotiationsListItem', {
            idItem: $scope.entity.id
          });

        } else {
          $state.go('negotiationItem',{
            idItem: $scope.entity.id
          });
        }
      } else {
        InstanceModal.loginModal({
  resolve: {
    DisplayTitleMessage: function () {
      return false;
    }
  }
});
      }
    }

    $scope.init();

  }

  angular.module('app.controllers')
  .controller('ItemDetailController', ItemDetailController);

}());

(function() {
  'use strict';

  HomeController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$window', 'SearchModelFactory', 'UtilsService', 'BranchIoService', 'LocationService', 'AdsItemService', 'CategoryService'];
  function HomeController ($scope, $rootScope, $state, $stateParams, $window, SearchModelFactory, UtilsService, BranchIoService, LocationService, AdsItemService, CategoryService) {

    'ngInject';
    /**
     * The 'state' is the one without location so we use the USA location if not,
     * that means we are in homeLocation as that state is the only other that uses this controller
     * so we ask for the location by the :locationId param
     */

    var locationPromise = $state.is('home') ?
      LocationService.getLocationUSA() :
      LocationService.getCityById($stateParams.locationId);
    var pageSize = 20;
    var radius = 20;
    var page = 0;
    var order = 'published,nearest';
    var getHomeItemsPaged = function () {};

    $scope.mySearchText = 'test';
    $scope.city_canonical_name = '';
    $scope.items = [];
    $scope.loading = true;
    $scope.hasMore = false;

    $scope.$on('vivalistItems.getMoreItems', function (e, scrollOptions) {
      scrollOptions.busy = true;
      $scope.getItems(function  () {
        scrollOptions.busy = !$scope.hasMore;
      });
    });

    var getMD = function () {
      var meta = {};
      if ($scope.items.length > 0) {
        meta['robots'] = 'index, follow';
      } else {
        meta['robots'] = 'follow, noindex';
      }

      meta['title'] = CategoryService.seoTags['Home Page'].title.replace(/#location#/g, $scope.city_canonical_name);
      meta['metaTitle'] = CategoryService.seoTags['Home Page'].metaTitle.replace(/#location#/g, $scope.city_canonical_name);
      meta['keywords'] = CategoryService.seoTags['Home Page'].metaKeywords.replace(/#location#/g, $scope.city_canonical_name);
      meta['description'] = CategoryService.seoTags['Home Page'].metaDescription.replace(/#location#/g, $scope.city_canonical_name);
      return meta;
    };

    getHomeItemsPaged = function (callback) {
        $scope.getItems(callback);
    };

    $scope.getItems = function(callback) {
      return locationPromise
          .then(function (responseLocation) {
            var items = [];
            $scope.city_canonical_name = responseLocation.canonical_name;
            var requestOptions = {
              page: page,
              pageSize: pageSize,
              order: order,
              radius: radius,
              latitude: responseLocation.latitude,
              longitude: responseLocation.longitude
            };
            var itemsPromise = $scope.isAuthenticated() ? AdsItemService.search(requestOptions) : AdsItemService.searchPublic(requestOptions);
            itemsPromise.then(function (resp) {
              $scope.items = $scope.items.concat(resp.data.items);
              $scope.loading = false;
              var totalItems = resp.data.totalElements;
              $scope.hasMore = pageSize * (page + 1) < totalItems;
              $rootScope.$emit('newMetaData', UtilsService.newMetadata($scope.metadata, getMD()));
              page = page + 1;
              if (callback) {
                callback();
              }
            });
          })
          .catch(function (err) {
            $scope.loading = false;
            console.log(err);
          });
    };


    getHomeItemsPaged();
  }

  angular.module('app.controllers')
  .controller('HomeController', HomeController);

}());

(function () {
  'use strict';

  GroupController.$inject = ['$rootScope', '$scope', '$window', 'AdsItemService', 'UserService', '$stateParams', '$state', 'UtilsService', 'GroupService', '$auth', 'InstanceModal'];
  function GroupController ($rootScope, $scope, $window, AdsItemService, UserService, $stateParams, $state, UtilsService, GroupService, $auth, InstanceModal) {
    'ngInject';

    var groupId = $stateParams.groupId;

    $scope.loadingGroup = true;
    $scope.loadingItems = false;
    $scope.hasMore = false;
    $scope.hasMoreSubscribers = false;
    $scope.groupItems = [];
    $scope.groupSubscribers = [];
    $scope.groupName = '';
    $scope.subscribeButtonText = 'SUSCRIBIR';
    $scope.isOwner = false;
    $scope.groupPromise = function () {
      var promise;
      if ($auth.isAuthenticated()) {
        promise = GroupService.find(groupId);
      } else {
        promise = GroupService.find(groupId, { 'includeAdminUser': true });
      }
      return promise;
    }


    var pageSize = 24;
    var page = 0;
    var pageSubscribers = 0;

    $scope.modalScrollBusy = true;

    $scope.getMoreSubscribers = function () {
      $scope.modalScrollBusy = true;
      return GroupService.getSubscribers(groupId, {
          page: pageSubscribers,
          pageSize: pageSize
        })
        .then(function (resp) {
          if (resp.data.amountUsersFound > 0) {
            $scope.groupSubscribers = $scope.groupSubscribers.concat(resp.data.users);
            angular.forEach($scope.groupSubscribers, function (subscriber, index) {
              subscriber.isFollowed = $auth.isAuthenticated() && subscriber.followedByUser;
            });
            var totalItems = resp.data.totalElements;
            $scope.hasMoreSubscribers = pageSize * (pageSubscribers + 1) < totalItems;
            pageSubscribers = pageSubscribers + 1;
            $scope.modalScrollBusy = false;
          } else {
            $scope.modalScrollBusy = true;
          }
        });
    };


    $scope.showSubscribersModal = function () {
      $('#modal-group-subscribers').modal();
      $scope.modalScrollBusy = false;
    };


    $scope.groupPromise()
      .then(function (resp) {
        if(resp.statusCode === 1){
          $rootScope.$emit('newMetaData', UtilsService.newMetadata($scope.metadata, {
            'title': resp.data.name + ' | Grupo en ' + resp.data.locationName + ' ' + resp.data.zipCode + ' | Vivanuncios Estados Unidos',
            'canonical': 'http://www.vivanuncios.com/gr/' + UtilsService.$formatURLString(resp.data.name) + '/' + resp.data.id
          }));
          $scope.group = resp.data;
          $scope.groupName = $scope.group.name;
          $scope.getMoreSubscribers().then(function(){
            $scope.modalScrollBusy = true;
          });
          if ($auth.isAuthenticated()) {
            $scope.isOwner = $scope.group.owner.username.toLowerCase() === $auth.getPayload().username.toLowerCase();
          }
          if ($scope.group.subscribers.length > 0 ) {
            $scope.subscribersPreview = shiftUserLogged($scope.group.subscribers.slice(0, 4));

            // $scope.subscribersPreview.unshift({
            //   picture: $scope.group.owner.profilePicture,
            //   userId: $scope.group.owner.id,
            //   username: $scope.group.owner.username
            // });
          } else if ($auth.isAuthenticated()) {
            // when a user is logged in the group endpoint only brings the subscribers that the user follows, so if the user doesn't follow any of the subscribers, the preview list will be empty. In this case we call the getSubscribers service to get them.
            GroupService.getSubscribers(groupId, {
                page: pageSubscribers,
                pageSize: pageSize
              })
            .then(function (resp) {
              $scope.subscribersPreview = _.map(resp.data.users.slice(0, 4), function (item) {
                return { username: item.username, picture: item.profilePicture };
              });
              $scope.subscribersPreview = shiftUserLogged($scope.subscribersPreview);
            });
          }
          if (resp.data.subscribed) {
            $scope.subscribeButtonText = 'SUSCRIPTO';
          }
          $scope.getMoreItemsPaged();
        } else {
          $state.go('error.groupNotFound');
        }
        $scope.loadingGroup = false;
        $scope.loadingItems = true;
      });

    function shiftUserLogged(suscribers) {
      if($auth.isAuthenticated()) {
        var index = suscribers.findIndex(function (suscriber) {
          return suscriber.username.toLowerCase() === $auth.getPayload().username.toLowerCase();
        });
        if (index >= 0) {
          suscribers.splice(index,1);
        }
        return suscribers;
      }
      return suscribers;
    }

    $scope.toggleSubscribe = function () {
      if ($scope.isAuthenticated()) {
        if($scope.group.subscribed){
          GroupService.unsubscribe(groupId).then(function (resp) {
            if(resp.statusCode === 1){
              $scope.group.subscribed = false;
              $scope.subscribeButtonText = 'SUSCRIBIR';
              return GroupService.getSubscribers(groupId, {
                    page: 0,
                    pageSize: pageSize
                  });
            }
          })
          .then(function (resp) {
            if (resp.data.amountUsersFound > 0) {
              $scope.groupSubscribers = resp.data.users;
              angular.forEach($scope.groupSubscribers, function (subscriber, index) {
                subscriber.isFollowed = $auth.isAuthenticated() && subscriber.followedByUser;
              });
              var totalItems = resp.data.totalElements;
              $scope.hasMoreSubscribers = pageSize * (pageSubscribers + 1) < totalItems;
              pageSubscribers = pageSubscribers + 1;
              $scope.subscribersPreview.forEach(function(val, index) {
                if (val.username.toLowerCase() === $auth.getPayload().username.toLowerCase()) {
                  $scope.subscribersPreview.splice(index,1);
                }
              });
              $scope.group.totalSubscribers = $scope.group.totalSubscribers - 1;
              $scope.modalScrollBusy = false;
            } else {
              $scope.modalScrollBusy = true;
            }
          });
        } else {
          GroupService.subscribe(groupId)
          .then(function (resp) {
            if(resp.statusCode === 1){
              $scope.group.subscribed = true;
              $scope.subscribeButtonText = 'SUSCRIPTO';
            return GroupService.getSubscribers(groupId, {
                    page: 0,
                    pageSize: pageSize
                  });
            }
          })
          .then(function (resp) {
            if (resp.data.amountUsersFound > 0) {
              $scope.groupSubscribers = resp.data.users;
              angular.forEach($scope.groupSubscribers, function (subscriber, index) {
                subscriber.isFollowed = $auth.isAuthenticated() && subscriber.followedByUser;
              });
              var totalItems = resp.data.totalElements;
              $scope.hasMoreSubscribers = pageSize * (pageSubscribers + 1) < totalItems;
              $scope.group.totalSubscribers = $scope.group.totalSubscribers + 1;
              pageSubscribers = pageSubscribers + 1;
              $scope.modalScrollBusy = false;
            } else {
              $scope.modalScrollBusy = true;
            }

          });
        }
      } else {
        InstanceModal.loginModal({
          resolve: {
            DisplayTitleMessage: function () {
              return false;
            }
          }
        });
      }
    };

    $scope.likeToggle = function (item) {
      if ($scope.isAuthenticated()) {
        if (item.status === 'ACTIVE') {
          AdsItemService.toggleLikeItem(item.id, !item.followedByUser).then(function () {
            item.followedByUser = !item.followedByUser;
            item.totalOfFollowers = item.followedByUser ?
            item.totalOfFollowers + 1 :
            item.totalOfFollowers - 1;
          });
        }
      } else {
        InstanceModal.loginModal({
  resolve: {
    DisplayTitleMessage: function () {
      return false;
    }
  }
});
      }
    };

    $scope.getMoreItemsPaged = function () {
      if (page === 0 || $scope.hasMore) {
        if ($scope.isAuthenticated()) {
          AdsItemService.search({
            pageSize: 24,
            tagNewItem: true,
            groupId: groupId,
            order: 'published',
            page: page
          })
            .then(function (resp) {
              $scope.groupItems = $scope.groupItems.concat(resp.data.items);
              UtilsService.getItemsUrl($scope.groupItems);
              var totalItems = resp.data.totalElements;
              $scope.hasMore = pageSize * (page + 1) < totalItems;
              page = page + 1;
              $scope.loadingItems = false;
            });
        } else {
          AdsItemService.searchPublic({
            pageSize: 24,
            groupId: groupId,
            order: 'published',
            page: page
          })
            .then(function (resp) {
              $scope.groupItems = $scope.groupItems.concat(resp.data.items);
              UtilsService.getItemsUrl($scope.groupItems);
              var totalItems = resp.data.totalElements;
              $scope.hasMore = pageSize * (page + 1) < totalItems;
              page = page + 1;
              $scope.loadingItems = false;
            });
        }
      }
    };

  }

  angular.module('app.controllers')
  .controller('GroupController', GroupController);

}());

(function () {
  'use strict';

  DownloadAppController.$inject = ['$scope', '$window', '$stateParams', 'BranchIoService'];
  function DownloadAppController ($scope, $window, $stateParams, BranchIoService) {

    'ngInject';

    $scope.phoneNumber = '';

    $window.scrollTo(0, 0);
    $scope.sendMeLink = function () {
      switch ($stateParams.smsType){
        case 'app':
          BranchIoService.sendSMS($scope.phoneNumber, 'app', {});
          break;
        case 'item':
          BranchIoService.sendSMS($scope.phoneNumber, 'item', {
            itemId: $stateParams.id,
            itemDescription: $stateParams.description,
            itemImage: $stateParams.img
          });
          break;
        case 'user':
          BranchIoService.sendSMS($scope.phoneNumber, 'user', {
            itemId: $stateParams.id,
            itemDescription: $stateParams.description,
            itemImage: $stateParams.img
          });
          break;
        default:
          BranchIoService.sendSMS($scope.phoneNumber, 'app', {});
          break;
      }
    };
  }

  angular.module('app.controllers')
  .controller('DownloadAppController', DownloadAppController);

}());

(function () {
  'use strict';

  DirectoryOfSearchesController.$inject = ['$scope', '$window'];
  function DirectoryOfSearchesController ($scope,$window) {
    'ngInject';

      var dataLayer = window.dataLayer = window.dataLayer || [];
      dataLayer.push({
        "p": {
          "t": "Sitemap"
        }
      });

    $window.scrollTo(0, 0);
  }

  angular.module('app.controllers')
  .controller('DirectoryOfSearchesController', DirectoryOfSearchesController);

}());

(function () {
  'use strict';

  DirectoryOfPeopleController.$inject = ['$scope', '$stateParams', '$location', '$filter', '$state', '$window', 'UserService', 'UtilsService', 'AdsItemService'];
  function DirectoryOfPeopleController ($scope, $stateParams, $location, $filter, $state, $window, UserService, UtilsService, AdsItemService) {

    'ngInject';

    $window.scrollTo(0, 0);

    var letter = ($stateParams.letter || 'A').toUpperCase();
    if($stateParams.letter == '' || $stateParams.letter == 'all' || $stateParams.letter == 'ALL'){
      letter = 'A';
    }
    $scope.letter = letter;
    var path = $location.path();

    var dataLayer = window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      "p": {
        "t": "Sitemap"
      }
    });

    UserService
              .byLetter(letter)
              .then(function(data){
                var sortingOrder = 'name';
                $scope.items = data.users;
                $scope.sortingOrder = sortingOrder;
                $scope.reverse = false;
                $scope.filteredItems = [];
                $scope.groupedItems = [];
                $scope.itemsPerPage = 25;
                $scope.pagedItems = [];
                $scope.currentPage = 0;

                var searchMatch = function (haystack, needle) {
                    if (!needle) {
                        return true;
                    }
                    return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
                };

                // init the filtered items
                $scope.search = function () {
                    $scope.filteredItems = $filter('filter')($scope.items, function (item) {
                      for(var attr in item) {
                        if(searchMatch(item[attr], $scope.query)){
                          return true;
                        }else{
                          return false;
                        }
                      }
                      return false;
                    });
                    if ($scope.sortingOrder !== '') {
                        $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
                    }
                    $scope.currentPage = 0;
                    $scope.groupToPages();
                };

                $scope.groupToPages = function () {
                    $scope.pagedItems = [];

                    for (var i = 0; i < $scope.filteredItems.length; i++) {
                        if (i % $scope.itemsPerPage === 0) {
                            $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
                        } else {
                            $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
                        }
                    }
                };

                $scope.range = function (start, end) {
                    var ret = [];
                    if (!end) {
                        end = start;
                        start = 0;
                    }
                    for (var i = start; i < end; i++) {
                        ret.push(i);
                    }
                    return ret;
                };

                $scope.prevPage = function () {
                    if ($scope.currentPage > 0) {
                        $scope.currentPage--;
                    }
                };
                $scope.nextPage = function () {
                    if ($scope.currentPage < $scope.pagedItems.length - 1) {
                        $scope.currentPage++;
                    }
                };
                $scope.setPage = function () {
                    $scope.currentPage = this.n;
                };
                $scope.search();
                });
    AdsItemService.getTopSellers(0, 0)
      .then(function(resp) {
        var topSellers = resp.rows;
        // var elementsPerColumn = Math.ceil(topSellers.length / perPage);
        // $scope.topSellers = UtilsService.transpose(UtilsService.splitArray(topSellers, elementsPerColumn))
      });

    $scope.isActiveLocation = function (viewLocation) {
      if(path == '/directory/people/' || path == '/directory/people' || path == '/directory/people/ALL' || path == '/directory/people/all' || path == '/directory/people/ALL/' || path == '/directory/people/all/'){
        path = '/directory/people/A';
      }
      return viewLocation === path;
    };
  }

angular.module('app.controllers')
.controller('DirectoryOfPeopleController', DirectoryOfPeopleController);

}());

(function () {
  'use strict';

  DirectoryOfLocationController.$inject = ['$scope', '$state', '$location', '$window', 'LocationService'];
  function DirectoryOfLocationController ($scope, $state, $location, $window, LocationService) {

    'ngInject';

    var dataLayer = window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      "p": {
        "t": "Sitemap"
      }
    });

    $scope.$state = $state;
    $scope.searchText = '';
    $scope.isEmptyField = true;
    $scope.emptyFieldValidate = false;
    var page = $state.params.page || 1;

    $scope.page = page;
    var perPage = 25;
    var numberOfColumns = 6;
    var ready = false;

    $scope.init = function () {
      LocationService.getAllStates().then(function (states) {
        $scope.statesOrigin = _.sortBy(removeDuplicateDataOnArray(states, JSON.stringify));
      }).then(function () {
        LocationService.getAllLocations().then(function (locations) {
          $scope.locationsOrigin = locations;
          ready = true;
          $scope.refresh();
        });
      });

      var destroydWatcher = $scope.$watch(function () {
        return $state.current.name +
            $state.params.letter +
            $state.params.page +
            $state.params.text +
            ready;
      }, function (newValue, oldValue) {
        if (newValue === oldValue || !ready){
            return;
        }
        $scope.refresh();
      });

      $scope.$on('$destroy',function(){
          destroydWatcher();
      });

    };

    $scope.isActiveLocation = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.refresh = function(){
      $window.scrollTo(0, 0);
        $scope.notCityFlag = false;
        $scope.searchText = toTitleCase($state.params.text || '');
        page = $state.params.page || 1;
        $scope.page = page;
        var letter = ($state.params.letter || 'A').toUpperCase();
        $scope.letter = letter;
        $scope.locationsForLetter = $scope.locationsOrigin.filter(function (city) {
          if($state.current.name === 'directory.location.search' || $state.current.name === 'directory.location.all'){
            return true;
          }
          return city.name.indexOf(letter) === 0;
        });

        if($state.current.name == 'directory.location.search'){

            $scope.locationsForLetter = $scope.locationsForLetter.filter(function(city,position){

                return city.name.indexOf($scope.searchText)==0;

            });
        }

        if($scope.locationsForLetter.length == 0 ){

            $scope.notCityFlag = true;

        }

        var counter= 0;

        $scope.locations = angular.copy($scope.locationsForLetter);

        $scope.states = $scope.statesOrigin.map(function(state){

            return {
                name: state,
                locations: $scope.locations.filter(function(city){


                    return city.state == state;


                })
            };

        });

        $scope.states = $scope.states.map(function(state){

            state.locations = state.locations.filter(function(city){

                var floor = perPage * ($scope.page -1);

                var roof = perPage * $scope.page;

                counter++;

                return counter>=floor && counter<roof;

            });

            return state;

        });

        var  elementsPerColumn = Math.ceil($scope.locationsForLetter.length / numberOfColumns);

        $scope.numberOfPages = Math.ceil($scope.locationsForLetter.length / perPage);

        $scope.pagesNumbers = [];
        for(var i = 1; i <= $scope.numberOfPages; i++){
            $scope.pagesNumbers.push(i);
        }

    };

    $scope.onclickSearchButton = function(){

       $state.go('directory.location.search',{text:$scope.searchAux});

        $scope.searchAux = '';

    };

    $scope.checkEmptyField = function () {

        $scope.isEmptyField = ($scope.searchText == '');

    };

    $scope.searchBarReset = function(){

        $scope.isEmptyField = true;
        $scope.searchText = '';

    };

    $scope.init();

    function removeDuplicateDataOnArray(a, key) {
        var seen = {};
        return a.filter(function(item) {
            var k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        })
    }
    $scope.isCurrentPage = function (p) {
      return p + 1 == page;
    }

    function toTitleCase(str)
    {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

  }

  angular.module('app.controllers')
  .controller('DirectoryOfLocationController', DirectoryOfLocationController);

}());

(function () {

  'use strict';

  CategoryHomeController.$inject = ['$scope', 'CategoryService'];
  function CategoryHomeController ($scope, CategoryService) {

    'ngInject';

    $scope.text = 'Category home view';

    $scope.init = function () {
      CategoryService.getSubcategoryList().then(function (response) {
        $scope.categories = response;
      });
    };

    $scope.init();
  }

  angular.module('app.controllers')
  .controller('CategoryHomeController', CategoryHomeController);

}());



(function() {
  'use strict';

  AppController.$inject = ['$scope', '$state', '$stateParams', '$rootScope', 'ChangePasswordService', 'UtilsService', '$location', 'currencyFilter', '$auth', '$timeout', 'UserService', '$uibModal', 'RecoverPasswordService'];
  function AppController ($scope, $state, $stateParams, $rootScope, ChangePasswordService, UtilsService, $location, currencyFilter, $auth, $timeout, UserService, $uibModal, RecoverPasswordService) {
    'ngInject';

    $scope.loginError = '';
    $scope.signUpError = {};
    $scope.signUpFunctions = {};
    $scope.passwordCb = {
      cb: function () {}
    };
    $scope.recoverpwdCb = {
      cb: function () {}
    };
    $scope.zipcodeCb = {
      cb: function () {}
    };
    $scope.verifyemailCb = {
      cb: function () {}
    };

    $scope.login = function (provider, credentials) {
      var authPromise = provider === 'facebook' ? $auth.authenticate('facebook') : $auth.login(credentials);
      return authPromise
        .then(function () {
          $scope.loginError = '';
          $('#login-form').modal('hide');
          $state.reload();
        })
        .catch(function (error) {
          var message = error.data.message;
          if (message === 'Nuevo usuario con facebook') {
            return error;
          } else {
            $scope.loginError = message;
          }
        });
    };
    // </editor-fold>

    $scope.isAuthenticated = function () {
      return $auth.isAuthenticated();
    };

    $scope.logout = function () {
      UserService.signOut().then(function (response) {
        $auth.logout();
        $state.reload();
      });

    };
    $scope.updateShowLoginModal = function () {
      $timeout(function () {
        $scope.loginError = '';
      });
    };

    // <editor-fold desc="Change Password Stuff">
    $scope.changePassword = function (passwords) {
      ChangePasswordService.changePassword(passwords)
        .then(function successCallback(resp) {
          if (resp.statusCode === 1) {
            $scope.passwordCb.cb('', true, true);
            // $scope.logout();
          } else {
            $scope.passwordCb.cb(resp.statusMessage, false, true);
          }
        }, function errorCallback(error) {
          $scope.passwordCb.cb('Ocurrió un error al procesar su solicitud, inténtelo más tarde', false, true);
          //console.log(error);
        });
    };

    $scope.recoverPassword = function (email) {
      RecoverPasswordService.recoverPassword(email)
        .then(function successCallback(resp) {
          if (resp.statusCode === 1) {
            $scope.recoverpwdCb.cb('', true, true);
          } else {
            $scope.recoverpwdCb.cb(resp.statusMessage, false, true);
          }
        }, function errorCallback(error) {
          $scope.recoverpwdCb.cb('Ocurrió un error al procesar tu solicitud, inténtalo más tarde', false, true);
          //console.log(error);
        });
    };

    $scope.verifyEmail = function () {
      UserService.verifyEmail()
      .then(function successCallback(resp) {
        if (resp.statusCode === 1) {
          $scope.verifyemailCb.cb('', true, true);
        } else {
          $scope.verifyemailCb.cb(resp.statusMessage, false, true);
        }
      }, function errorCallback(error) {
        $scope.verifyemailCb.cb('Ocurrió un error al procesar tu solicitud, inténtalo más tarde', false, true);
      });
    };
    // </editor-fold>

    // <editor-fold desc="signup stuff">
    $scope.signup = function (user) {
      $auth.signup(user)
        .then(function (response) {
          $auth.login({
            username: user.username,
            password: user.password
          }).then(function () {
            $('#login-form').modal('hide');
          });

        })
        .catch(function (error) {
          $scope.signUpError = error.data;
        });
    };
    // </editor-fold>

    $scope.editZipCode = function (location) {
      UserService.updateProfile($auth.getPayload().username, location)
        .then(function (resp) {
          if (resp.statusCode === 1) {
            $scope.zipcodeCb.cb('', true, true);
            $state.reload();
          } else {
            $scope.zipcodeCb.cb(resp.statusMessage, false, true);
          }
        }, function errorCallback(error) {
          $scope.zipcodeCb.cb('Ocurrió un error al procesar tu solicitud, inténtalo más tarde', false, true);
        });
    };

    $scope.metadata = angular.copy(appConfig.metadata);
    $scope.webmaster = angular.copy(appConfig.webmaster);

    // whenever a controller emits the newMetaData event, we update the app's metadata
    $rootScope.$on('newMetaData', function (event, metadata) {
      $scope.metadata = angular.copy(metadata);
    });

    $rootScope.$on('newMetaDataPromise', function (event, metadataPromise) {
      metadataPromise.then(function (metadata) {
        $scope.metadata = angular.copy(metadata);
      });
    });

    $scope.$on('defaultMetaData', function () {
      $scope.metadata = angular.copy(appConfig.metadata);
    });

    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        //console.log('Changed state [' + fromState.name + '] to [' + toState.name + ']');
        $scope.hideCities = toState.name.split('.')[0] === 'statics';
        $scope.metadata = angular.copy(appConfig.metadata);
      });

    $scope.$back = function () {
      window.history.back();
    };

    $scope.runningOnMobile = function () {
      return UtilsService.isRunningOnMobile();
    };

    $scope.openShareModal = function (template, type, info) {
      var templateUrl = 'views/partials/' + template;
      $uibModal.open({
        animation: false,
        templateUrl: templateUrl,
        controller: 'ModalShareController',
        keyboard: true,
        resolve: {
          entity: function () {
            return info;
          },
          url: function () {
            switch (type) {
            case 'app':
              return 'https://bnc.lt/VivanunciosUSA';
            case 'user':
              return $state.href('userProfile', {
                id: UtilsService.$formatURLString(info.username)
              }, {
                absolute: true
              });
            case 'item':
              return $state.href('item', {
                itemCategory: UtilsService.$formatURLString(info.category.name),
                itemName: UtilsService.$formatURLString(info.name),
                itemId: info.id
              }, {
                absolute: true
              });
            case 'group':
              return $state.href('group', {
                groupId: info.id,
                groupName: UtilsService.$formatURLString(info.name)
              }, {
                absolute: true
              });
            }
          },
          type: function () {
            return type;
          }
        }
      });
    };

    //

    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };

  }

  angular.module('app.controllers')
  .controller('AppController', AppController);

}());

(function() {
  'use strict';

  AcceptOfferNegotiationController.$inject = ['$scope', '$uibModalInstance', 'offer'];
  function AcceptOfferNegotiationController ($scope, $uibModalInstance, offer) {
    'ngInject';

    $scope.offer = offer;
    $scope.confirm = confirm;

    function confirm (flag) {
      $uibModalInstance.close(flag);
    }
  }

  angular.module('app.controllers')
  .controller('AcceptOfferNegotiationController', AcceptOfferNegotiationController);
}());


(function() {

  'use strict';

  AppTranslation.$inject = ['$translateProvider'];
  function AppTranslation ($translateProvider) {

    'ngInject';

    //To clean local storage navigate this url "chrome://chrome/settings/clearBrowserData"
    //Or from dev tools navigate menu "Resources" -> "LocalStorage"

    $translateProvider.useSanitizeValueStrategy('escape');

      //website_v2\app\data\en-US\resx_main.json
    $translateProvider.useStaticFilesLoader({
      prefix: 'data/',
      suffix: '/main.resource.json'
    });

    //set a default language
    $translateProvider.preferredLanguage( appConfig.defaultLanguage );
    $translateProvider.useLocalStorage();
  }

  angular.module('vivaApp')
  .config(AppTranslation);

}());

(function() {
  'use strict';

  AppBreadcrumb.$inject = ['$breadcrumbProvider'];
  function AppBreadcrumb ($breadcrumbProvider) {

    'ngInject';

    $breadcrumbProvider.setOptions({
      prefixStateName: 'home',
      templateUrl: 'views/breadcrumbs.html'
    });
  }

  angular.module('vivaApp').config(AppBreadcrumb);

}());

(function() {
  'use strict';

  AppAuthConfig.$inject = ['$authProvider'];
  HttpInteceptorsConfig.$inject = ['$httpProvider'];
  var SESSION_EXPIRED = false;

  function AppAuthConfig ($authProvider) {
    'ngInject';

    $authProvider.facebook({
      clientId: window.appConfig.facebook.clientId,
      scope: ['user_friends','email']
    });

  }

  function HttpInteceptorsConfig($httpProvider) {
    'ngInject';
    $httpProvider.interceptors.push(['$q', '$injector', function ($q, $injector) {
      'ngInject';
      var pwdChanged = false;
      return {
        'request': function (config) {
          if (config.url === '/api/users/v3/changepwd') {
            pwdChanged = true;
          }
          return config;
        },
        'response': function (response) {
          if (response.data.errorCode === 302 && !SESSION_EXPIRED && !pwdChanged) {
            pwdChanged = false;
            SESSION_EXPIRED = true;
            var uibModal = $injector.get('$uibModal');
            var modalInstance = uibModal.open({
              animation: true,
              templateUrl: 'views/partials/viva-session-expired.html',
              controller: 'VivaSessionExpiredController',
              windowClass: 'modal-make-offer-negotiation',
              keyboard: false
            });

            modalInstance.closed
            .then(function () {
              SESSION_EXPIRED = false;
            });
            return {};
          }
          return response;
        }
      }
    }]);
  }

  angular.module('vivaApp').config(AppAuthConfig);
  angular.module('vivaApp').config(HttpInteceptorsConfig);

}());
