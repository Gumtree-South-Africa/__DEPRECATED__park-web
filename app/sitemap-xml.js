// modules =================================================
var sm                    = require('sitemap');
var CronJob               = require('cron').CronJob;
var fs                    = require('fs');
var sitemapDataMock       = require('./sitemap-data');
var indexSitemap          = require('./index-sitemap-xml');
var serverConfig          = require('../config/app-server-config');
var Q                     = require('q');
var logger                = require('winston');
var builder               = require('xmlbuilder');

var splitArray = function (array, n) {
  var ta = [];
  for (var i = 0; i < array.length; i += n) {
    ta.push(array.slice(i, i + n));
  }
  return ta;
};

var splitedArrayToXML = function (array) {
  'use strict';

  let domain = `${serverConfig.sitemap.protocol}://${serverConfig.sitemap.domain}`;

  return array.map(a => {
    let root = builder.create('root');

    let urlSet = root.ele('urlset', {
      'xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      'xmlns:xhtml': "http://www.w3.org/1999/xhtml"
    });

    a.forEach(v => {
      let restOfUrl = v[0];
      let url = urlSet.ele('url');

      url.ele('loc', `${domain}/${restOfUrl}`);
      url.ele('changefreq', 'daily');

      if(v.length > 1){
        let appIndexingLink = v[1];
        url.ele('xhtml:link', {
          rel: 'alternate',
          href: appIndexingLink
        });
      }
    });

    return root.end({pretty: true});
  });
};

//var splitedArrayToXML = function (array) {
//  return array.map(a => sm.createSitemap(
//    {
//      hostname: `${serverConfig.sitemap.protocol}://${serverConfig.sitemap.domain}`,
//      cacheTime: 60000 * 60 * 24,                   // one day cache
//      urls: a.map(v => ({
//        url: '/' + v, changefreq: 'daily'
//      }))
//    }).toString());
//};



var getSiteMaps = function () {

  var promisedData = [sitemapDataMock.categoriesLocations(), sitemapDataMock.categories(), sitemapDataMock.locations(), sitemapDataMock.users(), sitemapDataMock.liveAdds()];

  return promisedData.map(p => p.then(resolvedPromise => {
      var name = resolvedPromise.name;
      var values = resolvedPromise.values;
      return {name: name, arrays: splitArray(values, serverConfig.sitemap.urlsPerFile)};
    })
    .then(obj => ({name: obj.name, xmls: splitedArrayToXML(obj.arrays)}))
    .then(obj => {
      var name = obj.name;
      return obj.xmls.map((s, i) => {
        var path = `${serverConfig.sitemap.protocol}://${serverConfig.sitemap.domain}/sitemaps/sitemap-${name}-${i}.xml`;
        var filePath = `./public/sitemaps/sitemap-${name}-${i}.xml`;
        if (!fs.existsSync("./public/sitemaps")){
          fs.mkdirSync("./public/sitemaps");
        }
        fs.writeFileSync(filePath, s);
        logger.info('[SITEMAP]: ' + path);
        return path;
      });
    }));

};

var start = new Date().getTime();


module.exports = {
  initXmlFile: function (){

    //create an empty sitemap.xml file if not exist.
    fs.exists(serverConfig.sitemap.location, function (exists) {
      if (!exists) {
        var xmlbody  = "<?xml version=\"1.0\"?>\r\n";
        xmlbody += "<root>\r\n";
        xmlbody += "  <sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"/>\r\n";
        xmlbody += "  <sitemap/>\r\n";
        xmlbody += "</root>\r\n";
        fs.writeFileSync(serverConfig.sitemap.location, xmlbody);
        logger.info('[SITEMAP]: Generated empty file:' + serverConfig.sitemap.location);
      }
    });

  },

  cronJob: new CronJob(
    serverConfig.sitemap.interval,
    function () {
      logger.info("[SITEMAP]: Starting: " + new Date().toISOString());
      Q.all(getSiteMaps()).then(sitemaps => {
        fs.writeFileSync(serverConfig.sitemap.location, indexSitemap.getIndexFile(sitemaps.reduce((a, b) => a.concat(b), [])));
        var end = new Date().getTime();
        logger.info("[SITEMAP]: Finishing: " + new Date().toISOString() +' It took: ' + (end - start)/1000 + ' seconds.', true);
      });
    },
    function () {
      logger.info('[SITEMAP] finish job');
    },
    false,
    'America/Los_Angeles')                        // maybe other timezone?
};