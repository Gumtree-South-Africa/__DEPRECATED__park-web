'use strict';

var logger = require('winston')
	, apiProxy = require('../rest-api-proxy-service')
	, apiRestConstants = require('../constants/rest-api-constants')
	, Q = require('q');

var apiCallsService = {};

apiCallsService.findItemById = findItemById;
apiCallsService.findUserByName = findUserByName;
apiCallsService.findUserItems = findUserItems;
apiCallsService.findItemData = findItemData;
apiCallsService.findGroupData = findGroupData;
apiCallsService.findGroupItems = findGroupItems;
apiCallsService.findItemsByCategory = findItemsByCategory;
apiCallsService.getGroupWithItems = getGroupWithItems;
apiCallsService.getUserWithItems = getUserWithItems;
apiCallsService.getCategories = getCategories;

function findItemById (itemId) {
	var uri = '/public/items/v3/' + itemId;
	var deferred = Q.defer();

	return apiProxy.get(uri)
		.then(apiResponse =>  apiResponse.data )
		.catch(err => {
			logger.error('[JS-DISABLED][Item]: %j', err);
			return deferred.reject(err);
     	});
}

function getUserWithItems(userName) {
  var user = {};
  return findUserByName(userName)
  .then(userData => {
    user = userData;
    return findUserItems(userName);
  })
  .then(items => {
    return {
      user: user,
      items: items
    }
  });
}

function findUserByName (userName) {
	var uri = '/public/users/v3/' + userName + '/info';
	var deferred = Q.defer();

	return apiProxy.get(uri)
      .then(apiResponse =>  apiResponse.data )
      .catch(err => {
        logger.warn('[OG error]: ' + err);
        return deferred.reject(err);
      });
};

function findUserItems(userName) {
  var uri = '/items/v3/user/' + userName;
  var deferred = Q.defer();

  return apiProxy.get(uri)
      .then(apiResponse =>  apiResponse.data )
      .catch(err => {
        logger.warn('[OG error]: ' + err);
        return deferred.reject(err);
      });
}

function findItemData (itemId) {
    var uri = '/public/items/v3/' + itemId;
    var deferred = Q.defer();
    return apiProxy.get(uri)
      .then(apiResponse =>  apiResponse.data )
      .catch(err => {
        logger.warn('[OG error]: ' + err);
        return deferred.reject(err);
      });
}

function getGroupWithItems(groupId) {
  var group = {};
  return findGroupData(groupId)
  .then(groupData => {
    group = groupData;
    return findGroupItems(groupId);
  })
  .then(items => {
    return {
      group: group,
      items: items
    }
  });
}

function findGroupData (groupId) {
    var uri = '/groups/v3/' + groupId;
    var deferred = Q.defer();
    return apiProxy.get(uri)
      .then(apiResponse => apiResponse.data)
      .catch(err => {
        logger.warn('[OG error]: ' + err);
        return deferred.reject(err);
    });
}

function findGroupItems (groupId) {
  var uri = '/groups/v3/' + groupId + '/items';
  var deferred = Q.defer();
  return apiProxy.get(uri)
    .then(apiResponse => apiResponse.data)
    .catch(err => {
        logger.warn('[OG error]: ' + err);
        return deferred.reject(err);
    });
}

function findItemsByCategory (params) {
  var uri = '/public/items/v3/search';
  var deferred = Q.defer();
  return apiProxy.get(uri, params)
    .then(apiResponse => apiResponse.data )
    .catch(err => {
        logger.info('[OG error]: ' + err);
        return deferred.reject(err);
    });
}

function getCategories () {
  var uri = '/public/categories/v3';
  var deferred = Q.defer();
  return apiProxy.get(uri)
    .then(apiResponse => apiResponse.data)
    .catch(err => {
      logger.info('[OG error]: ' + err);
      return deferred.reject(err);
    });
}

module.exports = apiCallsService;
