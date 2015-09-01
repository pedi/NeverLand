/**
 * Created by mohist on 9/1/15.
 */
$(document).ready(function() {
  $('.navbar a.dropdown-toggle').on('click', function(e) {
    var elmnt = $(this).parent().parent();
    if (!elmnt.hasClass('nav')) {
      var li = $(this).parent();
      var heightParent = parseInt(elmnt.css('height').replace('px', '')) / 2;
      var widthParent = parseInt(elmnt.css('width').replace('px', '')) - 10;

      if(!li.hasClass('open')) {
        li.parent().find("> .open").removeClass("open");
        li.addClass('open');
      }
      else li.removeClass('open');
      $(this).next().css('top', -2 +li[0].offsetTop + 'px');
      $(this).next().css('left', (widthParent+9) + 'px');

      return false;
    }
  });
});