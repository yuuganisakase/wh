/*! wwwwh - v0.1.0 - 2012-04-21
* https://github.com/yuuganisakase/jquery.wwwwh
* Copyright (c) 2012 oka; Licensed MIT, GPL */

(function($) {

  // Collection method.
  $.fn.awesome = function() {
    return this.each(function() {
      $(this).html('awesome');
    });
  };

  // Static method.
  $.awesome = function() {
    return 'awesome';
  };

  // Custom selector.
  $.expr[':'].awesome = function(elem) {
    return elem.textContent.indexOf('awesome') >= 0;
  };

}(jQuery));
