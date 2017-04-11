(function  () {

	'use strict';

	function VivaListItems ($rootScope, AdsItemService, $auth, $state, UtilsService, InstanceModal) {
    'ngInject';

		return {
			restrict: 'E',
			transclude: true,
			replace: true,
			templateUrl: 'views/partials/viva-list-items.directive.html',
			scope: {
				items : '=',
				openModal : '=',
				vivaLoader: '=',
				city: '='
			},
			link: function (scope, element, attr) {
				scope.firstCall = true;
				scope.scrollOptions = {
					busy: false
				};

				scope.getMoreItems = getMoreItems;
        scope.likeToggle = likeToggle;

        UtilsService.getItemsUrl(scope.items);

        scope.$watchCollection('items', watchItems);

        function getMoreItems () {
					scope.vivaLoader = true;
					scope.firstCall = false;
					$rootScope.$broadcast('vivalistItems.getMoreItems', scope.scrollOptions);

				}

        function likeToggle (item) {
					if($auth.isAuthenticated()) {
						AdsItemService.toggleLikeItem(item.id, !item.followedByUser)
						.then(function () {
							item.followedByUser = !item.followedByUser;
							item.totalOfFollowers = item.followedByUser ?
							item.totalOfFollowers + 1 :
							item.totalOfFollowers - 1;
						});
					}
					else {
						InstanceModal.loginModal({
  resolve: {
    DisplayTitleMessage: function () {
      return false;
    }
  }
});
					}
				}

        function watchItems (newV, oldV) {
          if (newV && newV.length) {
            UtilsService.getItemsUrl(scope.items);
          }
        }
			}
		};
	}

	angular.module('app.directives')
	.directive('vivaListItems',VivaListItems);

}());
