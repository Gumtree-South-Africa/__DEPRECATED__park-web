(function() {
  'use strict';

  function SearchModelFactory (LocationService, $q, $cookies) {
    'ngInject';

    var serviceInstance = {
      location: {},
      isInitialized: false

    };

    var model = {
      //This property is static
      defaultLocation: {
        id:'',
        name: appConfig.wholeCountryParams.name,
        state: '',
        latitude: 0,
        longitude: 0,
        userCoords: false
      },
      //This property is dynamic
      location: {
        id:'',
        name: '',
        state: '',
        latitude: 0,
        longitude: 0,
        userCoords: false
      }
    };

    var getIdLocation = function (city, state) {
      return (city.replace(/ /gi, '_') + '-' + state.replace(/ /gi, '_')).toLowerCase();
    };

    var updateId = function() {
      var id =  (model.location.name =='') ? model.defaultLocation.name : getIdLocation(model.location.name, model.location.state);
      model.location.id = id;
    };

    //readonly
    Object.defineProperty(serviceInstance.location, 'id', {
      get: function() {
          if (model.location.id == ''){
            updateId();
          }
          return model.location.id;
      }
    });

    Object.defineProperty(serviceInstance.location, 'name', {
      get: function() {
          return model.location.name;
      },
      set: function(name) {
          model.location.name = name;
          updateId();
      }
    });

    Object.defineProperty(serviceInstance.location, 'state', {
      get: function() {
          return model.location.state;
      },
      set: function(state) {
          model.location.state = state;
          updateId();
      }
    });

    Object.defineProperty(serviceInstance.location, 'latitude', {
      get: function() {
          return model.location.latitude;
      },
      set: function(latitude) {
          model.location.latitude = latitude;
          model.userCoords = true;
      }
    });

    Object.defineProperty(serviceInstance.location, 'longitude', {
      get: function() {
          return model.location.longitude;
      },
      set: function(longitude) {
          model.location.longitude = longitude;
          model.userCoords = true;
      }
    });

    Object.defineProperty(serviceInstance.location, 'userCoords', {
      get: function() {
          return model.location.userCoords;
      }
    });

    serviceInstance.isDefaultLocation = function() {
      return ((model.location.name =='' ) || (model.defaultLocation.name == model.location.name));
    };

    serviceInstance.getLocationId = function() {
      var id = (model.location.name =='') ? model.defaultLocation.name : getIdLocation(model.location.name, model.location.state);
      return id;
    };


    serviceInstance.getLocation = function(isWholeUsa) {
      if (typeof isWholeUsa !== 'undefined'){
        return (isWholeUsa) ? model.defaultLocation : model.location;
      }
      return model.location;
    }

    serviceInstance.reset = function() {
      model.location.id = '';
      model.location.name = '';
      model.location.state = '';
      model.location.latitude = 0;
      model.location.longitude = 0;
      model.location.userCoords = false;
      this.isInitialized = true;
    };


    serviceInstance.isLocationSynchronized = function(locationId) {
      if ((locationId) && (locationId == model.location.id)) {
        return true;
      }
      return false;
    }


    serviceInstance.synchronizeLocation = function(locationId) {
      var deferred = $q.defer();
      serviceInstance.isInitialized = true;

      var getCityPromise = LocationService.getCityById(locationId).then( function( city ){
        model.location.id = city.id;
        model.location.name = city.name;
        model.location.state = city.state;
        model.location.latitude = city.latitude;
        model.location.longitude = city.longitude;
      });
      deferred.resolve(getCityPromise);
      return deferred.promise;
    };

    serviceInstance.updateBreadcrumb = function(scope, term, isWholeUsa) {

      console.log(model.defaultLocation.name);
      angular.extend(scope, {
        brCrumb: {
          term: (isWholeUsa)? term  + ' in ' + model.defaultLocation.name : term,
          location: (isWholeUsa)? model.defaultLocation.name :  (model.location.name + ', ' +  model.location.state)
        }
      });

    };

    serviceInstance.updateLocationCoookie = function() {
      $cookies.put('location',model.location.id);
    }

    return serviceInstance;
  }

  angular.module('app.services')
  .factory('SearchModelFactory', SearchModelFactory);

}());

