"use strict";

var appServerConfig = require('../config/app-server-config')
  , appClientConfig = require('../config/app-client-config')
  , logger = require('winston')
  , rp = require('request-promise');

/**
 * Access token
 * @type {string}
 */
let accessToken = appClientConfig.mapboxApiToken;

/**
 * The list of all the states, anyone missing should be added here
 * @type {*[]}
 */
let statesCodes = [
  {name: 'Alabama', code: 'AL'},
  {name: 'Alaska', code: 'AK'},
  {name: 'Arizona', code: 'AZ'},
  {name: 'Arkansas', code: 'AR'},
  {name: 'California', code: 'CA'},
  {name: 'Colorado', code: 'CO'},
  {name: 'Connecticut', code: 'CT'},
  {name: 'Delaware', code: 'DE'},
  {name: 'District of Columbia', code: 'DC'},
  {name: 'Florida', code: 'FL'},
  {name: 'Georgia', code: 'GA'},
  {name: 'Hawaii', code: 'HI'},
  {name: 'Idaho', code: 'ID'},
  {name: 'Illinois', code: 'IL'},
  {name: 'Indiana', code: 'IN'},
  {name: 'Iowa', code: 'IA'},
  {name: 'Kansas', code: 'KS'},
  {name: 'Kentucky', code: 'KY'},
  {name: 'Louisiana', code: 'LA'},
  {name: 'Maine', code: 'ME'},
  {name: 'Maryland', code: 'MD'},
  {name: 'Massachusetts', code: 'MA'},
  {name: 'Michigan', code: 'MI'},
  {name: 'Minnesota', code: 'MN'},
  {name: 'Mississippi', code: 'MS'},
  {name: 'Missouri', code: 'MO'},
  {name: 'Montana', code: 'MT'},
  {name: 'Nebraska', code: 'NE'},
  {name: 'Nevada', code: 'NV'},
  {name: 'New Hampshire', code: 'NH'},
  {name: 'New Jersey', code: 'NJ'},
  {name: 'New Mexico', code: 'NM'},
  {name: 'New York', code: 'NY'},
  {name: 'North Carolina', code: 'NC'},
  {name: 'North Dakota', code: 'ND'},
  {name: 'Ohio', code: 'OH'},
  {name: 'Oklahoma', code: 'OK'},
  {name: 'Oregon', code: 'OR'},
  {name: 'Pennsylvania', code: 'PA'},
  {name: 'Rhode Island', code: 'RI'},
  {name: 'South Carolina', code: 'SC'},
  {name: 'South Dakota', code: 'SD'},
  {name: 'Tennessee', code: 'TN'},
  {name: 'Texas', code: 'TX'},
  {name: 'Utah', code: 'UT'},
  {name: 'Vermont', code: 'VT'},
  {name: 'Virginia', code: 'VA'},
  {name: 'Washington', code: 'WA'},
  {name: 'West Virginia', code: 'WV'},
  {name: 'Wisconsin', code: 'WI'},
  {name: 'Wyoming', code: 'WY'},
  {name: 'Puerto Rico', code: 'PR'}
];

// let ko = states.forEach(s => {
//   let state = getStateByName(s.state);
//   if(!state){
//     console.log(`${s.id}  ->  ${state}`);
//   } else {
//     // s.id = s.id.split('-')[0] + '-' + state.code.toLowerCase();
//     s.canonical_name = s.name + ', ' + state.code.toUpperCase();
//   }
// });


//////////////////////////////////
// Util Functions
//////////////////////////////////
let getStateByCode = code => statesCodes.find(state => state.code === code);

let getStateByName = name => statesCodes.find(state => state.name === name);


/**
 * This function adds some useful properties to the mapbox response, e.j. the id city_state
 * @param mr The mapbox response
 */
let mapMapBoxResponse = mr => mr.features.map(f => {
  let cl = {
    id_mapbox: f.id,
    latitude: f.center[1],
    longitude: f.center[0],
    name: f.text,
    place_name: f.place_name,
    context: f.context
  };
  if (f.id.startsWith('place')) {
    cl.state = cl.name.toLowerCase() === 'san juan' ? f.context[0].text : f.context[1].text;
    // if(f.context.length > 2){
    //   cl.state = f.context[2].short_code === 'pr' ? 'pr' : f.context[1].text
    // }
    let stateObject = getStateByName(cl.state);
    let stateCode = stateObject ? stateObject.code : cl.state.replace(/ /gi, '_');
    cl.id = (cl.name.replace(/ /gi, '_') + "-" + stateCode).toLowerCase();
    cl.canonical_name = cl.name + ', ' + stateCode;
  }
  return cl;
});

/**
 * This just filter the us (United States) and pr (Puerto Rico) results
 * @param features mapbox response
 */
let filterByUsPr = features =>
  features.filter(f => f.context.length > 0 &&
  (f.context[f.context.length - 1].short_code.toLowerCase() === 'us' || f.context[f.context.length - 1].short_code.toLowerCase() === 'pr'));


//////////////////////////////////
// The Module export
//////////////////////////////////
var LocationService = module.exports = {
  search: term => {
    let mb_query = `https://api.mapbox.com/geocoding/v5/mapbox.places/${term}.json?country=us&types=place&access_token=${accessToken}`;
    logger.log('verbose', '[Mapbox query by term] %s', mb_query);
    return rp({
      method: 'GET',
      uri: mb_query,
      json: true
    });
  },
  getById: locationId => {
    let locationWithSpaces = locationId === 'san-juan-pr' ? 'san juan' : locationId.replace(/-/gi, ' ').replace(/_/gi, ' ').replace(/,/, '').toLowerCase();
    return LocationService.search(locationWithSpaces)
      .then(mapMapBoxResponse)
      .then(results => results.find(r => r.id.slice(0,-3) === locationId.replace(/-/gi,"_").replace(/, /gi,'_').slice(0,-3).toLowerCase()));
  },
  getByLatLng: (lat, lng) => {
    let mb_query = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=place&access_token=${accessToken}`;
    logger.log('verbose', '[Mapbox query by lat-long] %s', mb_query);
    return rp({
      method: 'GET',
      uri: mb_query,
      json: true
    }).then(mapMapBoxResponse)
      .then(filterByUsPr);
  },
  localize: (ip) => {
    let uri_localize = `http://freegeoip.net/json/`;
    logger.log('verbose', '[Localize freegeoip by ip] %s', uri_localize);
    return rp({
      method: 'GET',
      uri: uri_localize,
      json: true
    });
  }
};
