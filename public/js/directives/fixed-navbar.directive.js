(function() {
  'use strict';

  function FixedNavbar ($state, screenSize) {
    'ngInject';

    return function (){

      $(window).scroll(function(){
        var navbar = $('.search-bar-container');
        var homebar = $('.border-back-home');
        var scrollTop = 300;
        var x = $(window).scrollTop();
        var body = $('body');
        if($state.current.name == 'home' || $state.current.name.startsWith('home.') ){
          body.removeClass('wrapbar');
          // console.log($state.current.name);
          if(x <= scrollTop){
            navbar.removeClass('stuck-navbar-home');
            homebar.removeClass('stuck-home');
            body.removeClass('wrapbar-home');

          }else{
            navbar.addClass('stuck-navbar-home');
            homebar.addClass('stuck-home');
            body.addClass('wrapbar-home');
            body.removeClass('wrapbar');

          }

        }else{
          navbar.addClass('stuck');
          body.addClass('wrapbar');
          body.removeClass('wrapbar-home');
          //console.log($state.current.name);

        }
      });
    };
  }

  angular.module('app.directives')
  .directive('fixedNavbar', FixedNavbar);

}());

