(function() {
  'use strict';

  function NegotiationAppRoutes ($stateProvider) {
    'ngInject';


    $stateProvider
      .state('negotiationsList',
      {
        url: '/negotiation/list',
        templateUrl: 'views/viva-negotiaions-list.html',
        controller: 'NegotiationsListController',
        resolve: {
          'isLogged' : ['$auth','$state', '$q', function($auth, $state, $q) {
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
          'isLogged' : ['$auth','$state', '$q', function($auth, $state, $q) {
            var deferred = $q.defer();
            deferred.resolve($auth.isAuthenticated());
            return deferred.promise.then(function(flag) {
              if (!flag) {
                $state.go('error.userAccessRestricted');
              }
            });
          }],
          'ListConversations' : ['NegotiationFactory','$stateParams', function(NegotiationFactory,$stateParams) {
            return NegotiationFactory.getListItemConversations($stateParams.idItem);
          }],
          'IdItem' : ['$stateParams' ,function($stateParams) {
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
            'isLogged' : ['$auth','$state', '$q', function($auth, $state, $q) {
              var deferred = $q.defer();
              deferred.resolve($auth.isAuthenticated());
              return deferred.promise.then(function(flag) {
                if (!flag) {
                  $state.go('error.userAccessRestricted');
                }
              });
            }],
            'Item': ['AdsItemService','$stateParams','$state','$auth','$q',function (AdsItemService, $stateParams, $state, $auth, $q) {
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
            'Conversation' : ['Item','NegotiationFactory','$auth', '$q','$state','AdsItemService','NegotiationService','$uibModal',function (Item, NegotiationFactory, $auth, $q, $state,AdsItemService,NegotiationService,$uibModal) {
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
            'isLogged' : ['$auth','$state', '$q', function($auth, $state, $q) {
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
            'Item': ['AdsItemService','Conversation',function (AdsItemService, Conversation) {
              return AdsItemService.find(Conversation.itemId);
            }]
          }
        });
  }

  angular.module('vivaApp')
  .config(NegotiationAppRoutes);

}());
