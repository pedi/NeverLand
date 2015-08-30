/**
 * Created by mohist on 8/30/15.
 */
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
  });

  // populate quantity select
  for (var i=0; i<20; i++) {
    $("#select-quantity").append("<option>" + (i+1) + "</option>");
  }

  // init model select handler
  $("#select-model").on("change", function(e) {
    var val = $(e.currentTarget).find(":selected").val();
    var options = JSON.parse(val);
    $("#select-finishes").empty();
    for (var i=0; i<options.length; i++) {
      var option = options[i];
      if (option.price != -1) {
        var optionDom = document.createElement("option");
        optionDom.value = option.price;
        optionDom.innerHTML = option.type;
        $("#select-finishes").append(optionDom);
      }

    }
    $("#select-finishes").trigger("change");
  });

  // the part we calculate the price shown
  $("#select-finishes").on("change", function(e) {
    updatePrice();
  });
  $("#select-quantity").on("change", function(e) {
    updatePrice();
  });
  $("#select-model").trigger("change");
}

function computePrice() {
  var price = parseFloat($("#select-finishes").find(":selected").val());
  var quantity = parseInt($("#select-quantity").find(":selected").val());
  var totalPrice = price * quantity;
  return totalPrice;
}

function updatePrice() {
  var total = computePrice();
  $("#span-price").text(total);
}