(function() {
  'use strict';

  function CategoryService ($http, $q, QueryApiService) {
    'ngInject';

    var cachedCategories = [];

    var codesToIds = {
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

    var idsToCodes = {
      11: '',
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

    var categoryService = {
      idsToCodes: idsToCodes,
      codesToIds: codesToIds,
      find: function (id) {
        return categoryService.all()
          .then(function (catPromise) {
            if (!id) {
              return catPromise.data.categories[0];
            }
            return _.find(catPromise.data.categories, function (category) {
              return category.id === parseInt(id);
            });
          })
      },
      findByCode: function (code) {
        var id = categoryService.codesToIds[code];
        return categoryService.find(id);
      },
      findByName: function (name) {
        categoryService.all()
          .then(function (catPromise) {
            return _.find(catPromise.data.categories, function (category) {
              return category.name === name;
            });
          })
      },
      all: function () {
        if (cachedCategories.length > 0) {
          return $q.when(cachedCategories);
        } else {
          return QueryApiService.makeRequest({
              method: 'GET',
              url: '/api/public/categories/v3'
            })
            .then(function (resp) {
              _.map(resp.data.categories, function (category) {
                category.code = idsToCodes[category.id];
                return category;
              });
              resp.data.categories[0].name = 'Todas';
              cachedCategories = resp;
              return resp;
            });
        }
      },
      seoTags: {
        'Todas': {
          code: 'N/A',
          title: 'Clasificados #location#',
          metaTitle: 'Clasificados Gratis | Anuncios Gratis | Vivanuncios #location#',
          metaKeywords: 'anuncios,clasificados,anuncios gratis, clasificados gratis',
          metaDescription: 'Clasificados Gratis para #location#. Vendé y compra de todo. Carros, Muebles, Ropa, Electrodomésticos, Celulares y mucho más. Vivanuncios #location#',
          metaH1: 'Anuncios Clasificados #location#'
        },
        'Cercanos': {
          code: 'N/A',
          title: 'Clasificados #location#',
          metaTitle: 'Clasificados Gratis | Anuncios Gratis | Vivanuncios #location#',
          metaKeywords: 'anuncios,clasificados,anuncios gratis, clasificados gratis',
          metaDescription: 'Clasificados Gratis para #location#. Vendé y compra de todo. Carros, Muebles, Ropa, Electrodomésticos, Celulares y mucho más. Vivanuncios #location#',
          metaH1: 'Anuncios Clasificados #location#'
        },
        'Home Page': {
          code: 'N/A',
          title: 'Clasificados #location#',
          metaTitle: 'Clasificados Gratis | Anuncios Gratis | Vivanuncios #location#',
          metaKeywords: 'anuncios,clasificados,anuncios gratis, clasificados gratis',
          metaDescription: 'Clasificados Gratis para #location#. Vendé y compra de todo. Carros, Muebles, Ropa, Electrodomésticos, Celulares y mucho más. Vivanuncios #location#',
          metaH1: 'Anuncios Clasificados #location#'
        },
        'Moda y Accesorios': {
          code: 'Ropa-Moda-Accesorios',
          title: 'Ropa y Accesorios #location#',
          metaTitle: 'Ropa en venta, accesorios y moda. Vivanuncios #location#',
          metaKeywords: 'ropa,ropa usada,ropa venta,accesorios moda',
          metaDescription: 'Ropa en venta en #location# Vivanuncios. Accesorios, moda, ropa de marca y mucho más en Vivanuncios #location#.',
          metaH1: 'Ropa y Accesorios en Venta #location#'
        },
        'Electrónica': {
          code: 'electronica-venta',
          title: 'Electrónicos #location#',
          metaTitle: 'Electrónica, Celulares y Computadoras en Venta',
          metaKeywords: 'electrónica,celulares,computadoras,televisores',
          metaDescription: 'Compra y vende celulares usados, computadoras, tablets, televisores, y mucho más en Vivanuncios #location#',
          metaH1: 'Celulares, Laptops, TV Usados #location#'
        },
        'Autos y Motos': {
          code: 'autos-usados-venta',
          title: 'Vehículos Usados #location#',
          metaTitle: 'Autos, Carros, Trocas y Motos Usadas en Vivanuncios #location#',
          metaKeywords: 'autos,carros,vans,trocas,motos,motoras',
          metaDescription: 'Autos y trocas usadas y nuevas en venta en #location#. Ecuentra autos, motos, trocas, usadas y nuevas en Vivanuncios #location#',
          metaH1: 'Vehículos Usados #location#'
        },
        'Niños y Bebés': {
          code: 'ninos-bebes',
          title: 'Bebés y Niños #location#',
          metaTitle: 'Accesorios para bebés y Niños en Vivanuncios #location#',
          metaKeywords: 'accesorios bebés,ropa niños',
          metaDescription: 'Accesorios para bebés y niños en Vivanuncios #location#. Ropa para bebés, venta de juguetes, carreolas nuevas y usadas, y más en Vivanuncios.',
          metaH1: 'Accesorios para Bebés y Niños #location#'
        },
        'Deportes y Ocio': {
          code: 'deportes-hobbies',
          title: 'Deportes y Hobbies #location#',
          metaTitle: 'Deportes y Hobbies en Vivanuncios #location#',
          metaKeywords: 'balones,pelotas,futbol,footbal,baseball',
          metaDescription: 'Bicicletas usadas, juegos de mesa, hobbies en Vivanuncios #location#. Encuentra de todo para el deporte en Vivanuncios',
          metaH1: 'Deportes y Hobbies #location#'
        },
        'Muebles y Hogar': {
          code: 'muebles-usados',
          title: 'Muebles y Hogar #location#',
          metaTitle: 'Muebles usados, decoración y muebles en venta en Vivanuncios #location#',
          metaKeywords: 'muebles,muebles usados,muebles en venta,decoración',
          metaDescription: 'Muebles usados y decoración en Vivanuncios #location#. Oportunidad en muebles usados y decoración para tu hogar en Vivanuncios.',
          metaH1: 'Muebles Usados y Decoración #location#'
        },
        'Electrodomésticos': {
          code: 'electrodomesticos',
          title: 'Electrodomésticos Usados #location#',
          metaTitle: 'Electrodomésticos usados a grandes precios en Vivanuncios #location#',
          metaKeywords: 'electrodomesticos,cafeteras,freidoras,cacharros',
          metaDescription: 'Electrodomésticos usados en venta en Vivanuncios #location#. Encuentra cafeteras, batidoras, parrillas, hornos y más en Vivanuncios.',
          metaH1: 'Electrodomésticos Usados #location#'
        },
        'Juegos y Películas': {
          code: 'juegos-peliculas',
          title: 'Juegos y Películas #location#',
          metaTitle: 'Juegos Usados, Videojuegos  y Películas en Vivanuncios #location#',
          metaKeywords: 'juegos,videojuegos,películas',
          metaDescription: 'Videojuegos usados, películas en venta en Vivanuncios #location#. Grandes ofertas en juegos usados en Vivanuncios.',
          metaH1: 'Videojuegos Usados #location#'
        },
        'Quinceañera y Eventos': {
          code: 'quinceaneras-fiestas',
          title: 'Quinceañeras y Eventos #location#',
          metaTitle: 'Vestidos de quinceañeras y servicios para quinceañeras #location#',
          metaKeywords: 'quinceaneras',
          metaDescription: 'Vestidos de Quinceañeras usados para la venta en Vivanuncios #location#. Eventos para quinceañeras en Vivanuncios.',
          metaH1: 'Vestidos para Quinceañeras #location#'
        },
        'Herramientas': {
          code: 'herramientas',
          title: 'Herramientas en Vivanuncios #location#',
          metaTitle: 'Herramientas en Vivanuncios #location#',
          metaKeywords: 'herramientas',
          metaDescription: 'Herramientas en Vivanuncios #location#. Herramientas en Vivanuncios.',
          metaH1: 'Herramientas #location#'
        },
        'Otros': {
          code: 'anuncios-gratis',
          title: 'De todo en Vivanuncios #location#',
          metaTitle: 'Anuncios clasificados en Vivanuncios #location#',
          metaKeywords: '',
          metaDescription: 'De todo en venta en Vivanuncios #location#. Clasificados de Usados y Seminuevos en Vivanuncios.',
          metaH1: 'Anuncios Gratis #location#'
        }
      }
    };

    return categoryService;
  }

  angular.module('app.services')
  .service('CategoryService', CategoryService);
}());

