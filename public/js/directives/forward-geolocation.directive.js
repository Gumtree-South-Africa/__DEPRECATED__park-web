/**
 * Mapbox forward geocoding autocomplete directive
 * https://github.com/Mike-Loffland/angular-mapbox-forward-geolocation-directive
 */

(function () {
    'use strict';

    function MapboxForwardGeocoding ($http, $timeout, LocationService) {
      'ngInject';

      return {
          restrict: 'AE',
          scope: {
              selectedLocation: '=',
              queryResults: '=',
              options: '=',
              apiToken: '=',
              searchText: '='
          },
          templateUrl: 'views/partials/forward-geolocation.html',
          link: function (scope, element, attrs) {

              scope.suggestions = [];
              scope.flagminerror = false;
              //scope.searchText = attrs.searchText === '$parent.inputText.location' ? '' : $parent.inputText.location;
              //scope.searchText = attrs.searchText;
              scope.searchTextTemp = '';
              scope.charQty = 15;
              scope.selectedLocationAvailable = angular.isDefined(attrs.selectedLocation);
              scope.wantResults = angular.isDefined(attrs.queryResults);
              // set defaults
              scope.apiToken = scope.apiToken ? scope.apiToken : 'YOU NEED TO SET YOUR API TOKEN';

              angular.extend(scope, {
                  // allow directive user to specify their own placeholder text
                  placeHolderText: 'Search for an address',
                  // allow directive user to specify their own placeholder text
                  minLengthErrorText: 'Search text must be at least %N% character(s).',
                  // allow directive user to determine what property they want to be used in the auto suggest results
                  displayProperty: 'place_name',
                  // allow directive user to exclude results where place_name is empty or absent in the mapbox results
                  excludeEntriesWithNoPlaceName: false,
                  // allow directive user to enable auto suggest
                  autoSuggest: true,
                  // allow directive user to specify their own string to use if displayProperty is empty
                  emptyPropertyText: '(empty property)',
                  // allow directive user to specify their own min length for determining when a search string is long enough to execute a query
                  minLength: 4,
                  // attempt to limit the Mapbox query results based on a keyword
                  includeThisKeyword: undefined
              });

              // use custom directive options if present
              if (!angular.isUndefined(scope.options)) {
                  angular.extend(scope, scope.options);

              }

              scope.minLengthErrorText = scope.minLengthErrorText.replace('%N%', scope.minLength);

              scope.search = function (src) {

                  if (angular.isUndefined(scope.searchText.searchLocationText) || (src == 'button' && !scope.wantResults)) {
                      // scope.searchText.searchLocationText will continue to be undefined until the ng-minlength requirements are met
                      // ||
                      // this is a button click... but, the directive user did not provide a scope variable for queryResults
                      return;
                  }
                  var localSearchText,
                      myurl;


                  if (scope.searchText.searchLocationText.length < scope.minLength) {
                      scope.flagminerror = true;
                      scope.suggestions = [];
                      return;
                  }

                  localSearchText = encodeURI(scope.searchText.searchLocationText);

                  // attempting to increase the relevance of Mapbox query results based on a keyword
                  // - i.e: includeThisKeyword = 'texas'
                  //    > should produce results more specific to Texas
                  if (scope.includeThisKeyword) {
                      if (localSearchText.toLowerCase().indexOf(scope.includeThisKeyword.toLowerCase()) < 0) {
                          localSearchText += '+' + scope.includeThisKeyword;
                      }
                  }

                  //myurl = 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places/' + localSearchText + '.json?access_token=' + scope.apiToken;

                  var typesCriteria = 'types=place&';
                  myurl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
                  + localSearchText
                  + '.json?'
                  + typesCriteria
                  + 'access_token=' + scope.apiToken;

                  $http.get(myurl)
                      .success(function (data) {
                          scope.suggestions = data.features.map(function (val) {
                              var mapped = LocationService.mapFeature(val);
                              // if the directive user wants to exclude results where place_name is empty or absent
                              if (scope.excludeEntriesWithNoPlaceName) {
                                  if (val.place_name) {
                                      return mapped;
                                  }
                              } else {
                                  return mapped;
                              }
                          }).filter(function (val) {
                              if (angular.isUndefined(val.context)) {
                                  return false;
                              } else {
                                  return val.context.length > 0 && (val.context.slice(-1)[0]['short_code'] === 'us' || val.context.slice(-1)[0]['short_code'] === 'pr');
                              }
                          });
                          // if the directive user wants the results returned to their own scope array
                          if ((src == 'button' && scope.wantResults)) {
                              scope.queryResults = scope.suggestions.slice(0);
                              scope.selectedLoc = scope.searchText.searchLocationText;
                              scope.searchText.searchLocationText = '';
                              scope.suggestions = [];
                          }

                      })
                      .error(function (data, status) {
                          var errorObj = {}, msg;
                          // empty the suggestion array
                          while (scope.suggestions.length > 0) {
                              scope.suggestions.pop();
                          }
                          msg = "Error al obtener las opciones de la busqueda";
                          errorObj[scope.displayProperty] = msg;
                          scope.suggestions.push(errorObj);
                      });
              };

              scope.useSelectedLocation = function (index) {
                  scope.selectedLocation = scope.suggestions[index];
                  scope.searchText.searchLocationText = scope.selectedLoc = scope.searchTextTemp = scope.selectedLocation.canonical_name;
                  scope.$root.$emit("location.changeMap", scope.selectedLocation);
                  // console.log(scope.searchText);
                  scope.suggestions = [];
              };

              scope.confirmSelection = function () {
                if (scope.selectedLocation !== undefined) {
                  scope.$root.$emit("location.changed", scope.selectedLocation);
                } else {
                  scope.$root.$emit("location.cancel");
                }

              };

              scope.$on('geolocation.update', function(event, newLocation) {
                scope.selectedLocation = newLocation;
              });

              scope.$on('searchNewLocation', function (event, searchTextLocation, callback) {
                  scope.searchText.searchLocationText = searchTextLocation;
                  scope.search();
                  document.querySelector('#mbac-searchInput').focus();
                  if (callback) {
                      callback();
                  }
              });
          }
      }
  }

    angular.module('app.directives')
    .directive('mapboxForwardGeocoding', MapboxForwardGeocoding);

}());
