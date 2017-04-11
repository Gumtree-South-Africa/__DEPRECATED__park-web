// modules =================================================
var express = require('express')
  , https = require('https')
  , http = require('http')
  , fs = require('fs-extra')
  , app = express()
  , methodOverride = require('method-override')
  , appConfig = require('./config/app-server-config')
  , logger = require('winston')
  , validateConfigServer = require('./validate-config-server');

process.title = process.argv[2];

// configuration ===========================================
app.set('view engine', 'jade');
app.set('views', './app/templates');

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/dist'));
app.use('/libs', express.static(__dirname + '/bower_components'));

// routes ==================================================


// Winston Logger config ==>
logger.add(logger.transports.File, {
  //name: 'log-file',
  filename: appConfig.logger.logFile, // logging file (externalized)
  level: appConfig.logger.level,      // logging level (externalized)
  timestamp: true,  // Boolean flag indicating if we should prepend output with timestamps
  json : false,   // If true, messages will be logged as JSON (default true).
  showLevel: true,  // Boolean flag indicating if we should prepend output with level (default true).
});

// remove console transport for non local envioronemnts
if (appConfig.env != 'local') {
  logger.remove(logger.transports.Console);
} else {
  // for local env DEGUB logging is enabled and also console is not removed
  logger.level = 'info'  // { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
}

if (validateConfigServer.validate()){
  var msgSettings = JSON.stringify(appConfig, null, 2); // pretty pinting - spacing level = 2
  logger.info('\n###############\n# Server is starting in %s environment (version %s) with the following appServerSettings :\n###############\n %s', appConfig.env, appConfig.version, msgSettings);


  require('./app/routes')(app); // pass our application into our routes



  // start app ===============================================
  var appPort = appConfig.appPort;
  app.listen(appPort);
  logger.info('(Http)  Web site running on port ' + appPort);
} else {
  logger.error("THE APP COULDN'T STARTED, check the logs");
}


exports = module.exports = app;
