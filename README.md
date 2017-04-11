# MEAN Stack Single Page Application Starter

##Prerequisites:
1. Node.js vrs5.1.0
2. Express
3. Npm 3.3.12
4. Bower 1.6.3
5. Jade(optional)
$npm install jade

## Installation
1. Download the repository
2. Install npm modules: `npm install`
3. Install bower dependencies `bower install`
4. Run gulp sass (to compile sass files)
5. Start up the server: `node server.js`
6. View in browser at http://localhost:8080

##Bower proxy

Each developer should overide the file website\.bowerrc  
with .bowerrc.no-proxy or .bowerrc.proxy to set or unset the proxy locally

## NODE ENV

We have defined 4 configuration setting for running the project:

1. NODE_ENV=dev node server.js
2. NODE_ENV=qc node server.js
3. NODE_ENV=qc2 node server.js
4. NODE_ENV=prod node server.js

The main difference is the sitemap generation, with dev and qc2, sitemap is inactive, with the other two the sitemap gets generated.

## Other environment variables to be able to set (config)
LOG_PATH = path to the log file, for example: /var/log/parkweb/parkweb.log
LOG_LEVEL = logging level: error | warn | info | verbose | debug | silly 

