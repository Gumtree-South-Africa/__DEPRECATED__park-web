var logger = require('winston')

var validateConfigServer = {};

validateConfigServer.validate = function () {
  var validation = true;

  if(!process.env.REST_API_URL) {
    logger.error("[ENV VAR]: REST_API_URL VAR ISN'T DEFINED")
    validation = false;
  }

  if(!process.env.PORT) {
    logger.warn("[ENV VAR]: PORT VAR ISN'T DEFINED. Defaulted to 8000");
  }

  if(!process.env.KEEP_ALIVE_CONN) {
    logger.error("[ENV VAR]: KEEP_ALIVE_CONN VAR ISN'T DEFINED");
    validation = false;
  }

  if(!process.env.LOG_PATH) {
    logger.error("[ENV VAR]: LOG_PATH VAR ISN'T DEFINED");
    validation = false;
  }

  if(!process.env.LOG_LEVEL) {
    logger.warn("[ENV VAR]: LOG_LEVEL VAR ISN'T DEFINED. Defaulter to 'info'");
  }

  if(!process.env.FACEBOOK_CLIENT_ID) {
    logger.error("[ENV VAR]: FACEBOOK_CLIENT_ID VAR ISN'T DEFINED");
    validation = false;
  }

  if(!process.env.FACEBOOK_CLIENT_SECRET) {
    logger.error("[ENV VAR]: FACEBOOK_CLIENT_SECRET VAR ISN'T DEFINED");
    validation = false;
  }

  if(!process.env.GOOGLE_ANALYTICS_TRACKING_ID) {
    logger.error("[ENV VAR]: GOOGLE_ANALYTICS_TRACKING_ID VAR ISN'T DEFINED");
    validation = false;
  }

  if(!process.env.BRANCHIO_ID) {
    logger.error("[ENV VAR]: BRANCHIO_ID VAR ISN'T DEFINED");
    validation = false;
  }

  if(!process.env.CANONICAL_HOST) {
    logger.error("[ENV VAR]: CANONICAL_HOST VAR ISN'T DEFINED");
    validation = false;
  }

  if(!process.env.NODE_ENV) {
    logger.error("[ENV VAR]: NODE_ENV VAR ISN'T DEFINED");
    validation = false;
  }

  return validation;
}

module.exports = validateConfigServer;
