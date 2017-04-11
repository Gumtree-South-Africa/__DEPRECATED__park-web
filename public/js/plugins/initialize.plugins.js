(function() {
  'use strict';

  $(document).ready(main);

  function main(){
    onScrollEventsMarketing();
  }

  function onScrollEventsMarketing(){
      $( window ).scroll(function() {
      var disco = $('.marketing-section').visible(true);
      if(disco){
        $('#step-1').addClass('animated fadeInDown');

        // step 2
        setTimeout(function () {
          $('#step-2').addClass('animated fadeInDown');
        }, 300);

        // step 3
        setTimeout(function () {
          $('#step-3').addClass('animated fadeInDown');
        }, 600);
      }
    });
  }

}());
