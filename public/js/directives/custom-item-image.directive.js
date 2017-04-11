(function() {
  'use strict';

  function CustomItemImage ($parse, $document, $timeout) {
    'ngInject';

    var getImageAlt = function (index, thumbnail, description, photoCount) {
      if(thumbnail){
        return description + ' thumbnail ' + (parseInt(index) + 1);
      }
      if(photoCount > 1){
        return description + ' image ' + (parseInt(index) + 1);
      } else {
        return description;
      }
    };
    return {
      restrict: 'E',
      scope: {itemId:"=", imgNumber:"="},
      template: "<div afkl-lazy-image='{{ imgPath }}{{ itemId }}{{ imageHtmlParam }}{{ sizeParams }}{{ numberHtmlParam }}{{ imgNumber }}' class='afkl-lazy-wrapper afkl-img-ratio-1-1' afkl-lazy-image-options='{{ altt }}'></div>",
      link: function (scope,element,attrs) {


        scope.thumbnail = attrs.thumb;
        scope.description = attrs.description;
        scope.photoCount = attrs.photocount;


        //force the image preloading
        scope.imgPath = '/images/preload_item_image.png';
        scope.itemId = '';
        scope.imageHtmlParam = '';
        scope.sizeParams = '';
        scope.numberHtmlParam= '';
        scope.imgNumber = '';
        scope.altt = '';

        //mySercer.com/v1/items/568c212f9655ed736585caab/image?number=0
        var generateImagePath = function(){
          //generate the real image path
          scope.imgPath = appConfig.imgUrlTemplate;
          scope.itemId = attrs.itemid;
          scope.imageHtmlParam = '/image?';
          scope.sizeParams = '';
          scope.numberHtmlParam= 'number=';
          scope.imgNumber = attrs.imgnumber;

          if (attrs.width){
            scope.sizeParams += 'width=' + attrs.width + '&'
          }
          if (attrs.height){
            scope.sizeParams += 'height=' + attrs.height + '&'
          }

          //for non static images, observe attributes changes and refresh local directive scope
          if(!attrs.isstatic){
            attrs.$observe('itemid', function (newValue) {
              scope.itemId = newValue
            });
            attrs.$observe('imgnumber', function (newValue) {
              scope.imgNumber = newValue;
              scope.altt = getImageAlt(scope.imgNumber, scope.thumbnail, scope.description, scope.photoCount);
            });
            attrs.$observe('description', function (newValue) {
              scope.description = newValue;
              scope.altt = getImageAlt(scope.imgNumber, scope.thumbnail, scope.description, scope.photoCount);
            });
            attrs.$observe('photocount', function (newValue) {
              scope.photoCount = newValue;
              scope.altt = getImageAlt(scope.imgNumber, scope.thumbnail, scope.description, scope.photoCount);
            });
          }

        }
        $timeout(generateImagePath,50);
        if(attrs.myalt){
          scope.altt = '{"alt":"'+attrs.myalt+'"}';
        }
      }
    };
  }

  angular.module('app.directives')
  .directive('customItemImage', CustomItemImage);

}());
