//Default Settins
var AppServerConfig = {

  version : "3.0.1-r04",
  restApiUrl: process.env.REST_API_URL,
  //proxyUrl: process.env.PROXY_URL,
  redirects: {
    help: "https://www.vivanuncios.us/statics/support",
    helpPrivateChat: "https://www.vivanuncios.us/statics/support",
    helpProfile: "https://www.vivanuncios.us/statics/support",
    itunes: "https://itunes.apple.com/us/app/id962230049",
    googleplay: "https://play.google.com/store/apps/details?id=com.ebay.park"
  },
  appPort: process.env.PORT || 8000,
  restKeepAliveConnections: (typeof process.env.KEEP_ALIVE_CONN === 'undefined') ? true : ('true' === process.env.KEEP_ALIVE_CONN),
  logger: {
    logFile: process.env.LOG_PATH,
    level: process.env.LOG_LEVEL || 'info'
  },
  proxy: process.env.PROXY_URL,
  restOurFavoritesPageLimit: 10,
  restHomePageLimit: 12,
  restSearchPageLimit: 20,
  restDefPageLimit: 12,
  restMaxDistance: 50,
  wholeCountryParams: {
    distance: 1500,  //USA Horizontal Width: 2,680 milesm, Vertical Length: 1,582 miles
    latitude: 38.8265,
    longitude: -97.6123
  },
  defaultLocationParams: {
    distance: 1500,
    latitude: 29.75,
    longitude: -95.36
  },
  trendingRanks: {
    offers: 10,
    watchers: 5,
    viewers: 1
  },
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET
  },
  googleAnalyticsTrackingId : process.env.GOOGLE_ANALYTICS_TRACKING_ID,
  branchIOId : process.env.BRANCHIO_ID,
  canonicalHost: process.env.CANONICAL_HOST,
  env: process.env.NODE_ENV
};

module.exports = AppServerConfig;
