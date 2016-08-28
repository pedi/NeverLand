$(function() {
  initDom();
});

function initDom() {
  //initialize swiper when document ready
  var mySwiper = new Swiper ('.swiper-container', {
    // Optional parameters
    loop: true,
    // If we need pagination
    pagination: '.swiper-pagination',
    paginationClickable : "true"
  });
}
