(function () {
  'use strict';

  function DirectoryOfPeopleController ($scope, $stateParams, $location, $filter, $state, $window, UserService, UtilsService, AdsItemService) {

    'ngInject';

    $window.scrollTo(0, 0);

    var letter = ($stateParams.letter || 'A').toUpperCase();
    if($stateParams.letter == '' || $stateParams.letter == 'all' || $stateParams.letter == 'ALL'){
      letter = 'A';
    }
    $scope.letter = letter;
    var path = $location.path();

    var dataLayer = window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      "p": {
        "t": "Sitemap"
      }
    });

    UserService
              .byLetter(letter)
              .then(function(data){
                var sortingOrder = 'name';
                $scope.items = data.users;
                $scope.sortingOrder = sortingOrder;
                $scope.reverse = false;
                $scope.filteredItems = [];
                $scope.groupedItems = [];
                $scope.itemsPerPage = 25;
                $scope.pagedItems = [];
                $scope.currentPage = 0;

                var searchMatch = function (haystack, needle) {
                    if (!needle) {
                        return true;
                    }
                    return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
                };

                // init the filtered items
                $scope.search = function () {
                    $scope.filteredItems = $filter('filter')($scope.items, function (item) {
                      for(var attr in item) {
                        if(searchMatch(item[attr], $scope.query)){
                          return true;
                        }else{
                          return false;
                        }
                      }
                      return false;
                    });
                    if ($scope.sortingOrder !== '') {
                        $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
                    }
                    $scope.currentPage = 0;
                    $scope.groupToPages();
                };

                $scope.groupToPages = function () {
                    $scope.pagedItems = [];

                    for (var i = 0; i < $scope.filteredItems.length; i++) {
                        if (i % $scope.itemsPerPage === 0) {
                            $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
                        } else {
                            $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
                        }
                    }
                };

                $scope.range = function (start, end) {
                    var ret = [];
                    if (!end) {
                        end = start;
                        start = 0;
                    }
                    for (var i = start; i < end; i++) {
                        ret.push(i);
                    }
                    return ret;
                };

                $scope.prevPage = function () {
                    if ($scope.currentPage > 0) {
                        $scope.currentPage--;
                    }
                };
                $scope.nextPage = function () {
                    if ($scope.currentPage < $scope.pagedItems.length - 1) {
                        $scope.currentPage++;
                    }
                };
                $scope.setPage = function () {
                    $scope.currentPage = this.n;
                };
                $scope.search();
                });
    AdsItemService.getTopSellers(0, 0)
      .then(function(resp) {
        var topSellers = resp.rows;
        // var elementsPerColumn = Math.ceil(topSellers.length / perPage);
        // $scope.topSellers = UtilsService.transpose(UtilsService.splitArray(topSellers, elementsPerColumn))
      });

    $scope.isActiveLocation = function (viewLocation) {
      if(path == '/directory/people/' || path == '/directory/people' || path == '/directory/people/ALL' || path == '/directory/people/all' || path == '/directory/people/ALL/' || path == '/directory/people/all/'){
        path = '/directory/people/A';
      }
      return viewLocation === path;
    };
  }

angular.module('app.controllers')
.controller('DirectoryOfPeopleController', DirectoryOfPeopleController);

}());
