(function() {
  'use strict';

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
