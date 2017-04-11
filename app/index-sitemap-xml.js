// modules =================================================
var fs = require('fs');
var builder = require('xmlbuilder');
var logger  = require('winston');


module.exports = {
  getIndexFile: function (sitemaps) {
    var root = builder.create('root');
    logger.info('[SITEMAP]: ' + sitemaps);
    root.ele('sitemapindex', {xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'});
    sitemaps.forEach(s => {
      var sitemap = root.ele('sitemap');
      sitemap.ele('loc', s);
      sitemap.ele('lastmod', new Date().toISOString());
    });
    return root.end({pretty: true});
  }
};