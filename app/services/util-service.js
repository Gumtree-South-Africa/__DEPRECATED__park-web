
'use strict';

var utilService = {};

utilService.formatURLString = function formatURLString (string, limit) {
    var mustLimit = typeof limit !== 'undefined';
    if (string == undefined || string == '' || typeof string !== 'string') {
      string = '';
    } else {
      var strlength = string.length;
      if (mustLimit && strlength > limit) {
        string = string.substring(0, limit);
      }
      string = string.toLowerCase();
      string = string.replace(/[\!|\"|\#|\$|\%|\&|'|\(|\)|\*|\+|\,|\\|\.|\/|\:|\;|\<|\=|\>|\!|\¿|\?|\@|\[|\||\]|\^|\`|\{|\||\}|\~]/gi, '');
      string = string.replace(/[\_|]/gi, '-')
      string = string.replace(/[\á|\ä|\à|\â|\Á|\Ä|\À|\Â]/gi, 'a');
      string = string.replace(/[\é|\è|\ë|\ê|\É|\Ë|\È|\Ê]/gi, 'e');
      string = string.replace(/[\í|\ì|\ï|\î|\Í|\Ï|\Ì|\Î]/gi, 'i');
      string = string.replace(/[\ó|\ò|\ö|\ô|\Ó|\Ö|\Ò|\Ô]/gi, 'o');
      string = string.replace(/[\ú|\ù|\ü|\û|\Ú|\Ü|\Ù|\Û]/gi, 'u');
      string = string.replace(/[\ñ|\Ñ]/gi, 'n');
      string = string.replace(/(?:\uD83C[\uDF00-\uDFFF])|(?:\uD83D[\uDC00-\uDDFF])/gi, '-');
      string = string.trim().replace(/\ |\t|\r|\n|\v|\f/gi, '-').replace(/[\-]{2,}/, '-');
    }
  return string;
};

utilService.getBotMetaContent = function getBotMetaContent (path, canonical) {
  canonical = canonical.replace('https://www.vivanuncios.us','');
  canonical = canonical.replace('http://www.vivanuncios.us','');
  canonical = canonical.replace('https://vivanuncios.us','');
  canonical = canonical.replace('http://vivanuncios.us','');
  return path === canonical ? "index, follow" : "noindex, follow"
}

utilService.getCategoryName = function getCategoryName (categoryId) {
  var idsToCodes = {
    11: 'cercanos',
    19: 'ropa-moda-accesorios',
    5: 'electronica-venta',
    8: 'autos-usados-venta',
    13: 'ninos-bebes',
    6: 'deportes-hobbies',
    15: 'muebles-usados',
    9: 'electrodomesticos',
    20: 'juegos-peliculas',
    1: 'quinceaneras-fiestas',
    10: 'anuncios-gratis',
    21: 'herramientas'
  };
  return idsToCodes[categoryId];
};

utilService.getCategoryId = function getCategoryId (categoryName) {
  var codesToIds = {
    'cercanos': 11,
    'ropa-moda-accesorios': 19,
    'electronica-venta': 5,
    'autos-usados-venta': 8,
    'ninos-bebes': 13,
    'deportes-hobbies': 6,
    'muebles-usados': 15,
    'electrodomesticos': 9,
    'juegos-peliculas': 20,
    'quinceaneras-fiestas': 1,
    'anuncios-gratis': 10,
    'herramientas': 21
  };
  return codesToIds[utilService.formatURLString(categoryName)];
};

module.exports = utilService;
