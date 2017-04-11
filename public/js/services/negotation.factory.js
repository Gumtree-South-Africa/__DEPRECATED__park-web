(function() {
  'use strict';

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
