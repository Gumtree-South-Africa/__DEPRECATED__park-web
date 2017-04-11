var appConfig = {
  environment: 'dev',
  defaultLanguage: 'en-US', //'es-ES'

  countryLocationFilter: 'United States',
  countryLocationFilterCode: 'us',

  //Production url
  //imgUrlTemplate: 'https://images-server.close5.com/v1/items/',

  //Mapbox apiToken
  ///// API TOKEN created by Gervasio for DEV and QA: pk.eyJ1IjoicGFya3dlYi1kZXYiLCJhIjoiY2luYnIycmR3MG5wZnY4a3F4cmRsanQ2OCJ9.GmQtliZ2zqMgbgHNt1D5-w
  ///// Change for a definitive one
  mapboxApiToken: 'pk.eyJ1IjoicGFya3dlYi1kZXYiLCJhIjoiY2luYnIycmR3MG5wZnY4a3F4cmRsanQ2OCJ9.GmQtliZ2zqMgbgHNt1D5-w',

  // mapboxApiToken: 'pk.eyJ1IjoiZ2xiLWNsb3NlNS1kZXYiLCJhIjoiY2lndnFiNTg0MHJ3MndjbTVsNm9tbGlzcSJ9.2aduoMYlifVdZUtAAkDSdA',
  //Cente of USA for goe location queries
  mapSetting: {
    redCircleRadioMiles: 1, // 1 mile 1609,34 meters
    zoom: 13,
    style: 'streets'
  },


  // TODO: set branch.io properties when available
  smartBanner: {
    itemDetailLink: '',
    branchId: '',
    phone: '',
    referrerAction: '',
    og_app_id: ''
  },

  wholeCountryParams: {
    name: 'USA',
    latitude: 38.8265,
    longitude: -97.6123
  },

  defaultLocationParams: {
    distance: 1500,
    latitude: 29.75,
    longitude: -95.36
  },

  facebook: {
    //appId: '196869340515530'  //FIXME: Set the facebook app id here
  },

  api: {
    namespace: 'api',
    version: 'v3'
  },

  metadata: {
    hasPaginationPrev: false,
    hasPaginationNext: false,
    hasAppIndexing: false,
    appIndexLink: '',
    title: 'Vivanuncios, donde Compras y Vendes rápido ',
    description: '',
    next: '',
    prev: '',
    robots: 'index, follow',
    canonical: 'https://www.vivanuncios.us',
    facebook: {
      title: 'title',
      siteName: 'siteName',
      url: 'http://199.223.233.164:8000',
      caption: 'The caption',
      description: 'dynamic description from angular controller',
      id: 'id',
      type: 'type',
      locale: 'locale',
      author: 'author',
      publisher: 'publisher',
      image: 'https://lh6.ggpht.com/f7fIJyVd0IduXYnAQ5GW4PEgfdQBxqgLCfRHeBBFifYweV2KEXRM6jFj7WiDfYuvtbk=w300'
    }
  }
};
module.exports = appConfig;
