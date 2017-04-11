
'use strict';

var apiProxy = require('./rest-api-proxy-service');
var apiCalls = require('./services/api-calls-service');
var logger = require('winston');
var utilService = require('./services/util-service');
var constants = require('./constants/constants');
var serverConfig = require('../config/app-server-config');
// build meta-data

var capitalize = function (input, all) {
  var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
  return (!!input) ? input.replace(reg, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  }) : '';
};

var MakeMetaData = {
  validateBot: validateBot,
  isBot: isBot,
  homeData: homeData,
  vipData: vipData,
  userWithItems: userWithItems,
  userData: userData,
  itemData: itemData ,
  groupWithItems : groupWithItems,
  groupData: groupData,
  searchByCategoryData: searchByCategoryData
};

function validateBot (req, callbackAfirmative, callbackNegative) {
  let userAgent = req.headers['user-agent'];
  if (this.isBot(userAgent)) {
    if (callbackAfirmative) {
      callbackAfirmative()
    }
  } else {
    if (callbackNegative) {
      callbackNegative();
    }
  }
}

function isBot (ua) {
  return !!ua && (ua.match('(w|W)hatsApp|Googlebot|(F|f)acebot|(T|t)witterbot|(P|p)interest|jack|facebookexternalhit\/.*|Applebot|FlipboardProxy|Go 1.1 package|HTMLParser|simplereach|python-requests|ShowyouBot|MetaURI|nineconnections|(^Java\/[0-9._]*)|Commons-HttpClient|InAGist|HTTP-Java-Client|curl|Bot|B-O-T|Crawler|Spider|Spyder|Yahoo|ia_archiver|Covario-IDS|findlinks|DataparkSearch|larbin|Mediapartners-Google|NG-Search|Snappy|Teoma|Jeeves|Charlotte|NewsGator|TinEye|Cerberian|SearchSight|Zao|Scrubby|Qseero|PycURL|Pompos|oegp|SBIder|yoogliFetchAgent|yacy|webcollage|VYU2|voyager|updated|truwoGPS|StackRambler|Sqworm|silk|semanticdiscovery|ScoutJet|Nymesis|NetResearchServer|MVAClient|mogimogi|Mnogosearch|Arachmo|Accoona|holmes|htdig|ichiro|webis|LinkWalker|lwp-trivial|facebookexternalhit|monit\/|ELB-HealthChecker\//i|Telegram(B|b)ot|Slackbot') !== null);
}

function homeData (req, location) {
  var host = serverConfig.canonicalHost || req.protocol + '://' + req.hostname;
  var canonical = host + '/home/' + utilService.formatURLString(location.canonical_name);
  var description = 'Clasificados Gratis para ' + location.canonical_name + '. Vendé y compra de todo. Carros, Muebles, Ropa, Electrodomésticos, Celulares y mucho más. Vivanuncios ' + location.canonical_name;
  var robots = utilService.getBotMetaContent(req.path, canonical);
  var image = '';
  var title = 'Clasificados ' + location.canonical_name;
  return {
    seo: {
      title: title,
      canonical: canonical,
      description: description,
      robots: robots
    },
    facebook: {
      id: serverConfig.facebook.clientId,
      url: canonical,
      type: 'website',
      title: title,
      description: description,
      image: image
    },
    twitter: {
      card: 'summary',
      account: constants.twitterAccount,
      title: title,
      description: description,
      image: image
    },
    socials: getSocials(),
    categories: getCategories(location.id),
    cities: getCities(),
    statics: getStatics()
  };
}

function vipData (item, user, req, mapBox) {
  var host = serverConfig.canonicalHost || req.protocol + '://' + req.hostname;
  var canonical = host + '/pr/' + utilService.formatURLString(item.category.name) + '/' + utilService.formatURLString(item.name) + '/' + item.id;
  var robots = utilService.getBotMetaContent(req.path, canonical);
  var title = item.name + " en " + item.locationName + " " + item.zipCode + " | Vivanuncios Estados Unidos";

  item.description = item.description || 'Gana $ Vendiendo eso que no usas en Vivanuncios.';
  item.user.href = '/profile/' + item.user.username;
  var description = item.description + ' | ' + item.locationName + ' | Vivanuncios';
  var categoriesJson = require('./data/categories');
  var userLocationSplit = item.user.locationName.split(',');
  item.user = user.user;
  item.user.items = user.items.items;
  item.user.locality = userLocationSplit[0];
  item.user.region = userLocationSplit[1];

  categoriesJson.categories.forEach(function(category) {
    if (category.id === item.category.id) {
      item.category.href = '/c/' + mapBox.id + '/' + category.canonical;
    }
  });

  if(!item.user.profilePicture) {
    item.user.profilePicture = constants.defaults.profilePicture;
  }

  return {
    data: item,
    seo: {
      title: title,
      canonical: canonical,
      description: description,
      robots: robots
    },
    facebook: {
      id: serverConfig.facebook.clientId,
      url: canonical,
      type: 'website',
      title: title,
      description: description,
      image: item.pictures[0]
    },
    twitter: {
      card: 'summary',
      account: constants.twitterAccount,
      title: title,
      description: description,
      image: item.pictures[0]
    },
    socials: getSocials(),
    categories: getCategories(mapBox.id),
    cities: getCities(),
    statics: getStatics()
  };
}

function userWithItems(userExtended, req, mapBox) {
  var host = serverConfig.canonicalHost || req.protocol + '://' + req.hostname;
  var dataToRender = userData(userExtended.user, host, req.path, mapBox);
  dataToRender.data.items = userExtended.items.items;
  dataToRender.data.items.forEach(function(item) {
    item.vipUrl = '/pr/' + utilService.formatURLString(item.category.name) + '/' + utilService.formatURLString(item.name) + '/' + item.id;
  });
  return dataToRender;
}

function userData (user, host, path, location) {
  if (user === undefined) {
    return {};
  }

  var canonical = host + '/profile/' + user.username;
  var robots = utilService.getBotMetaContent(path, canonical);
  var title = user.username + ' vende en Vivanuncios ' + user.locationName;
  var description = 'Encuentra todos los anuncios de ' + user.username + ' en ' + user.locationName;
  user.profilePicture = user.profilePicture || constants.defaults.profilePicture;
  return {
    data: user,
    seo: {
      title: title,
      canonical: canonical,
      description: description,
      robots: robots
    },
    facebook: {
      id: serverConfig.facebook.clientId,
      url: canonical,
      type: 'profile',
      title: title,
      description: description,
      image: user.profilePicture
    },
    twitter: {
      card: 'summary',
      account: constants.twitterAccount,
      title: title,
      description: description,
      image: user.profilePicture
    },
    socials: getSocials(),
    categories: getCategories(location.id),
    cities: getCities(),
    statics: getStatics()
  };
}

function itemData (id) {
  return apiCalls.findItemData(id);
}

function groupWithItems(groupExtended, req, mapBox) {
  var host = serverConfig.canonicalHost || req.protocol + '://' + req.hostname;
  var dataToRender = groupData(groupExtended.group, host, req.path, mapBox);
  dataToRender.data.items = groupExtended.items.items;
  dataToRender.data.items.forEach(function(item) {
    item.vipUrl = '/pr/' + utilService.formatURLString(item.category.name) + '/' + utilService.formatURLString(item.name) + '/' + item.id;
  });
  return dataToRender;
}

function groupData (group, host, path, location) {
  var canonical = host + '/gr/' + utilService.formatURLString(group.name) + '/' + group.id;
  group.name = capitalize(group.name, true);
  var title = group.name + ' | Grupo de Ventas en Vivanuncios ' + group.locationName;
  var description = 'En ' + group.name + ' venden ' + group.totalSubscribers + ' personas en ' + group.locationName + ' | Vivanuncios';
  group.description = capitalize(group.description, false) || description;
  return {
    data: group,
    seo: {
      title: title,
      canonical: canonical,
      description: description,
      robots: utilService.getBotMetaContent(path, canonical)
    },
    facebook: {
      id: serverConfig.facebook.clientId,
      url: canonical,
      type: 'website',
      title: title,
      description: description,
      image: group.pictureUrl
    },
    twitter: {
      card: 'summary',
      account: constants.twitterAccount,
      title: title,
      description: description,
      image: group.pictureUrl
    },
    socials: getSocials(),
    categories: getCategories(location.id),
    cities: getCities(),
    statics: getStatics()
  };
}

function searchByCategoryData (search, req, mapBox) {
  var title = '';
  var host = serverConfig.canonicalHost || req.protocol + '://' + req.hostname;
  var canonicalHost = host + '/c/';
  var locationFormatted = utilService.formatURLString(search.locationCanonical);
  var canonical = canonicalHost + locationFormatted + '/' + req.params.category;
  var metaH1 = '';
  var description = '';
  var image = '';
  var categoryName = utilService.formatURLString(req.params.category);

  search.categories.forEach(function (category) {
    category.url = '/c/' + locationFormatted + '/' + utilService.getCategoryName(category.id);
  });

  switch(categoryName) {
    case 'ropa-moda-accesorios':
      title = 'Ropa y Accesorios ' + search.locationCanonical;
      description = 'Ropa en venta en ' + search.locationCanonical + '. Accesorios, moda, ropa de marca y mucho más en Vivanuncios.';
      metaH1 = 'Ropa y Accesorios en Venta ' + search.locationCanonical;
      break;
    case 'electronica-venta':
      title = 'Electrónicos ' + search.locationCanonical;
      description = 'Compra y vende celulares usados, computadoras, tablets, televisores, y mucho más en Vivanuncios';
      metaH1 = 'Celulares, Laptops, TV Usados ' + search.locationCanonical;
      break;
    case 'autos-usados-venta':
      title = 'Vehículos Usados ' + search.locationCanonical;
      description = 'Autos y trocas usadas y nuevas en venta en ' + search.locationCanonical + '. Ecuentra autos, motos, trocas, usadas y nuevas en Vivanuncios';
      metaH1 = 'Vehículos Usados ' + search.locationCanonical;
      break;
    case 'ninos-bebes':
      title = 'Bebés y Niños ' + search.locationCanonical;
      description = 'Accesorios para bebés y niños en ' + search.locationCanonical + '. Ropa para bebés, venta de juguetes, carreolas nuevas y usadas, y más en Vivanuncios.';
      metaH1 = 'Accesorios para Bebés y Niños ' + search.locationCanonical;
      break;
    case 'deportes-hobbies':
      title = 'Deportes y Hobbies ' + search.locationCanonical;
      description = 'Bicicletas usadas, juegos de mesa, hobbies en ' + search.locationCanonical + '. Encuentra de todo para el deporte en Vivanuncios';
      metaH1 = 'Deportes y Hobbies ' + search.locationCanonical;
      break;
    case 'muebles-usados':
      title = 'Muebles y Hogar ' + search.locationCanonical;
      description = 'Muebles usados y decoración en ' + search.locationCanonical + '. Oportunidad en muebles usados y decoración para tu hogar en Vivanuncios.';
      metaH1 = 'Muebles Usados y Decoración ' + search.locationCanonical;
      break;
    case 'electrodomesticos':
      title = 'Electrodomésticos Usados ' + search.locationCanonical;
      description = 'Electrodomésticos usados en venta en ' + search.locationCanonical + '. Encuentra cafeteras, batidoras, parrillas, hornos y más en Vivanuncios.';
      metaH1 = 'Electrodomésticos Usados ' + search.locationCanonical;
      break;
    case 'juegos-peliculas':
      title = 'Juegos y Películas ' + search.locationCanonical;
      description = 'Videojuegos usados, películas en venta en ' + search.locationCanonical + '. Grandes ofertas en juegos usados en Vivanuncios.';
      metaH1 = 'Videojuegos Usados ' + search.locationCanonical;
      break;
    case 'quinceaneras-fiestas':
      title = 'Quinceañeras y Eventos ' + search.locationCanonical;
      description = 'Vestidos de Quinceañeras usados para la venta en ' + search.locationCanonical + '. Eventos para quinceañeras en Vivanuncios.';
      metaH1 = 'Vestidos para Quinceañeras ' + search.locationCanonical;
      break;
    case 'herramientas':
      title = 'Herramientas ' + search.locationCanonical + ' | Vivanuncios';
      description = 'Herramientas nuevas y usadas en venta en ' + search.locationCanonical + '. Encuentra herramientas en Vivanuncios.';
      metaH1 = 'Herramientas ' + search.locationCanonical;
      break;
    case 'anuncios-gratis':
      title = 'De todo en Vivanuncios ' + search.locationCanonical;
      description = 'De todo en venta en ' + search.locationCanonical + '. Clasificados de Usados y Seminuevos en Vivanuncios.';
      metaH1 = 'Anuncios Gratis ' + search.locationCanonical;
      break;
    default:
  }
  search.metaH1 = metaH1;
  return {
    data: search,
    seo: {
      title: title,
      canonical: canonical,
      description: description,
      robots: utilService.getBotMetaContent(req.path, canonical)
    },
    facebook: {
      id: serverConfig.facebook.clientId,
      url: canonical,
      type: 'website',
      title: title,
      description: description,
      image: image
    },
    twitter: {
      card: 'summary',
      account: constants.twitterAccount,
      title: title,
      description: description,
      image: image
    },
    socials: getSocials(),
    categories: getCategories(mapBox.id),
    cities: getCities(),
    statics: getStatics()
  };
}

function getSocials () {
  return [
    {
      name: 'Facebook',
      link: 'https://www.facebook.com/vivanunciosus'
    },
    {
      name: 'YouTube',
      link: 'https://www.youtube.com/channel/UCvhS_ZqXYDURLPG494E9M8Q'
    }
  ];
}

function getCategories (location) {
  var categoriesJson = require('./data/categories');
  categoriesJson.categories.forEach(function (category) {
    category.link = '/c/' + location + '/' + category.canonical;
  });
  return categoriesJson.categories;
}

function getCities () {
  var citiesJson = require('./data/popularCities');
  citiesJson.cities.forEach(function(city) {
    city.link = '/home/' + city.canonical;
  });
  return citiesJson.cities;
}

function getStatics () {
  var listStaticPagesJson = require('./data/list-static-pages');
  listStaticPagesJson.statics.forEach(function(el) {
    el.link = '/statics/' + el.canonical;
  });
  return listStaticPagesJson.statics;
}

module.exports = MakeMetaData;
