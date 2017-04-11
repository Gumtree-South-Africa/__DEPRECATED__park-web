(function () {
  'use strict';

  function DirectoryOfLocationController ($scope, $state, $location, $window, LocationService) {

    'ngInject';

    var dataLayer = window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      "p": {
        "t": "Sitemap"
      }
    });

    $scope.$state = $state;
    $scope.searchText = '';
    $scope.isEmptyField = true;
    $scope.emptyFieldValidate = false;
    var page = $state.params.page || 1;

    $scope.page = page;
    var perPage = 25;
    var numberOfColumns = 6;
    var ready = false;

    $scope.init = function () {
      LocationService.getAllStates().then(function (states) {
        $scope.statesOrigin = _.sortBy(removeDuplicateDataOnArray(states, JSON.stringify));
      }).then(function () {
        LocationService.getAllLocations().then(function (locations) {
          $scope.locationsOrigin = locations;
          ready = true;
          $scope.refresh();
        });
      });

      var destroydWatcher = $scope.$watch(function () {
        return $state.current.name +
            $state.params.letter +
            $state.params.page +
            $state.params.text +
            ready;
      }, function (newValue, oldValue) {
        if (newValue === oldValue || !ready){
            return;
        }
        $scope.refresh();
      });

      $scope.$on('$destroy',function(){
          destroydWatcher();
      });

    };

    $scope.isActiveLocation = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.refresh = function(){
      $window.scrollTo(0, 0);
        $scope.notCityFlag = false;
        $scope.searchText = toTitleCase($state.params.text || '');
        page = $state.params.page || 1;
        $scope.page = page;
        var letter = ($state.params.letter || 'A').toUpperCase();
        $scope.letter = letter;
        $scope.locationsForLetter = $scope.locationsOrigin.filter(function (city) {
          if($state.current.name === 'directory.location.search' || $state.current.name === 'directory.location.all'){
            return true;
          }
          return city.name.indexOf(letter) === 0;
        });

        if($state.current.name == 'directory.location.search'){

            $scope.locationsForLetter = $scope.locationsForLetter.filter(function(city,position){

                return city.name.indexOf($scope.searchText)==0;

            });
        }

        if($scope.locationsForLetter.length == 0 ){

            $scope.notCityFlag = true;

        }

        var counter= 0;

        $scope.locations = angular.copy($scope.locationsForLetter);

        $scope.states = $scope.statesOrigin.map(function(state){

            return {
                name: state,
                locations: $scope.locations.filter(function(city){


                    return city.state == state;


                })
            };

        });

        $scope.states = $scope.states.map(function(state){

            state.locations = state.locations.filter(function(city){

                var floor = perPage * ($scope.page -1);

                var roof = perPage * $scope.page;

                counter++;

                return counter>=floor && counter<roof;

            });

            return state;

        });

        var  elementsPerColumn = Math.ceil($scope.locationsForLetter.length / numberOfColumns);

        $scope.numberOfPages = Math.ceil($scope.locationsForLetter.length / perPage);

        $scope.pagesNumbers = [];
        for(var i = 1; i <= $scope.numberOfPages; i++){
            $scope.pagesNumbers.push(i);
        }

    };

    $scope.onclickSearchButton = function(){

       $state.go('directory.location.search',{text:$scope.searchAux});

        $scope.searchAux = '';

    };

    $scope.checkEmptyField = function () {

        $scope.isEmptyField = ($scope.searchText == '');

    };

    $scope.searchBarReset = function(){

        $scope.isEmptyField = true;
        $scope.searchText = '';

    };

    $scope.init();

    function removeDuplicateDataOnArray(a, key) {
        var seen = {};
        return a.filter(function(item) {
            var k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        })
    }
    $scope.isCurrentPage = function (p) {
      return p + 1 == page;
    }

    function toTitleCase(str)
    {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

  }

  angular.module('app.controllers')
  .controller('DirectoryOfLocationController', DirectoryOfLocationController);

}());
