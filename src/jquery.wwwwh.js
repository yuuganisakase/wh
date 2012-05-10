/*
 * jquery.wwwwh
 * https://github.com/yuuganisakase/jquery.wwwwh
 *
 * Copyright (c) 2012 oka
 * Licensed under the MIT, GPL licenses.
 */

(function($) {

  // Collection method.
  $.fn.awesome = function() {
    return this.each(function() {
      $(this).html('awesome');
    });
  };

  // Static method.
  $.awesome = function() {
    var x = 123;
    var x = 23;
    return 'awesome';
  };

  // Custom selector.
  $.expr[':'].awesome = function(elem) {
    return elem.textContent.indexOf('awesome') >= 0;
  };

}(jQuery));