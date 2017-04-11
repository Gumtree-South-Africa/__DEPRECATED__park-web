var appServerConfig = require('../config/app-server-config');
var rp = require('request-promise');
var http = require('http');
var logger = require('winston');


var keepAliveAgent = new http.Agent({keepAlive: appServerConfig.restKeepAliveConnections});

var sortTrendingByRank = function (item1, item2){
    var rank1 = item1.offers.length * appServerConfig.trendingRanks.offers
                + item1.watchers.length * appServerConfig.trendingRanks.watchers
                + item1.viewersCount * appServerConfig.trendingRanks.viewers;

    var rank2 = item2.offers.length * appServerConfig.trendingRanks.offers
                + item2.watchers.length * appServerConfig.trendingRanks.watchers
                + item2.viewersCount * appServerConfig.trendingRanks.viewers;

    return rank1 - rank2;
};

var sortTopSellers = function (item1, item2){
        return item1.numberOfItems - item2.numberOfItems;
}

var RestApiProxyService = {

    //USA with maxDistance=1600
    getCoordParams: function(latitude, longitude){
        var maxDistance = appServerConfig.restMaxDistance;
        if ((latitude == '0' && longitude == '0') || (latitude == 0 && longitude == 0) || (typeof latitude === 'undefined' && typeof longitude === 'undefined')) {
            //No coord where suplied, use whole use coordinates
            latitude = appServerConfig.wholeCountryParams.latitude;
            longitude = appServerConfig.wholeCountryParams.longitude;
            maxDistance = appServerConfig.wholeCountryParams.distance;
        }

        return '&lat=' + latitude + '&lon=' + longitude + '&distance=' + maxDistance;
    },

    getCoordParamsWithMaxDistance: function(latitude, longitude){
        var maxDistance = appServerConfig.restMaxDistance;
        if ((latitude == '0' && longitude == '0') || (latitude == 0 && longitude == 0) || (typeof latitude === 'undefined' && typeof longitude === 'undefined')) {
            //No coord where suplied, use whole use coordinates
            latitude = appServerConfig.wholeCountryParams.latitude;
            longitude = appServerConfig.wholeCountryParams.longitude;
            maxDistance = appServerConfig.wholeCountryParams.distance;
        }

        return '&lat=' + latitude + '&lon=' + longitude + '&maxDistance=' + maxDistance;
    },

    //USA with out maxDistance
    /*
    getCoordParams: function(latitude, longitude){
        var maxDistance = appServerConfig.restMaxDistance;
        var maxDistParam = '&maxDistance=' + maxDistance;
        if ((latitude == '0' && longitude == '0') || (latitude == 0 && longitude == 0) || (typeof latitude === 'undefined' && typeof longitude === 'undefined')) {
            //No coord where suplied, use whole use coordinates
            latitude = appServerConfig.wholeCountryParams.latitude;
            longitude = appServerConfig.wholeCountryParams.longitude;
            maxDistance = appServerConfig.wholeCountryParams.distance;
            maxDistParam = '';
        }

        return '&lat=' + latitude + '&lon=' + longitude + maxDistParam;
    },
    */

    getPageParams: function(pageNumber, firstSeparator, pageSize){
        if (!firstSeparator)
            firstSeparator = '&';
        var limit = (typeof pageSize == 'undefined') ? appServerConfig.restDefPageLimit : pageSize;
        var skipParam = firstSeparator + 'skip=' + ((pageNumber-1) * limit);
        var limitParam = '&limit=' + limit;
        return skipParam + limitParam;
    },

    getLimitParams: function(firstSeparator, pageSize){
        if (!firstSeparator)
            firstSeparator = '&';
        var limit = (typeof pageSize == 'undefined') ? appServerConfig.restDefPageLimit : pageSize;
        var limitParam = firstSeparator + 'limit=' + limit;
        return  limitParam;
    },

    get: function (apiUri, params) {
        var options = {
            method: 'GET',
            uri: appServerConfig.restApiUrl + apiUri,
            qs: params,
            headers: {
                'x-device-platform': 'com',
                'Content-Type' : 'application/json; charset=utf-8'
            },
            json: true
        };
        logger.log('verbose', '[API] : %s', options.uri);
        return rp(options);
    },

    post: function (apiUri, data) {
        var options = {
            method: 'POST',
            uri: appServerConfig.restApiUrl + '/' + apiUri,
            body: data,
            json: true,
            headers: {
                'x-device-platform': 'com',
                'Content-Type': 'application/json'
            }
        };
        logger.log('verbose', '[API] : %s', options.uri);
        return rp(options);
    },

    resetPasswordEmail: function(pathUrl, email) {
        var options = {
            method:'POST',
            uri: appServerConfig.restApiUrl +'/'+  pathUrl,
            body: email,
            json: true,
            headers:{
                'x-device-platform': 'com',
                'User-Agent': 'viva-web',
                'host': appServerConfig.restApiUrl,
                'Content-Type': 'application/json'
            }
        };
        return rp(options);
    },

    getTrendingItems: function (itemList) {

        for (i=0; i < itemList.length; i++){
            if (!itemList[i].live){
                itemList.splice(i, 1);
            }
        }
        output = itemList.reverse(sortTrendingByRank);
        return output;
    },

    getTopSellers: function (response, page) {
        var totalLimit = 4*appServerConfig.restHomePageLimit;
        var output = {
            hasMore: false,
            total:0,
            count:0,
            rows: []
        }
        output.rows = response.rows.sort(sortTopSellers).reverse();
        output.total = response.total > totalLimit ? totalLimit : response.total;

        //slice resutl by page
        var skip = (page-1) * appServerConfig.restHomePageLimit;
        if (output.total > skip) {
            output.rows = output.rows.slice(skip, skip + appServerConfig.restHomePageLimit);
        }else{
            output.rows = [];
        }
        output.count = output.rows.length;

        if (output.total > (skip + appServerConfig.restHomePageLimit)){
            output.hasMore = true;
        }

        return output;
    }

};

module.exports = RestApiProxyService;


