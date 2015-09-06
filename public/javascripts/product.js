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
    paginationClickable : "true"
  });

  // init collapse handle
  //$(".collapse-wrapper").each(function(wrapper) {
  //  $(wrapper).height = $(wrapper).find(".collapse-wraper-inner").outerHeight(true));
  //});
  $(".collapse-toggle").on("click", function(e) {
    var toggleDom = $(e.currentTarget);
    var wrapper = $(toggleDom.prev(".collapse-wrapper"));
    if (toggleDom.hasClass("to-collapse")) {
      wrapper.height(0);
    } else {
      wrapper.height(wrapper.find(".collapse-wrapper-inner").outerHeight(true));
    }
    toggleDom.toggleClass("to-collapse");
  });


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
        optionDom.innerHTML = "Fabric Price " + option.type;
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
  var ratio = parseFloat($("#select-quantity").find(":selected").val());
  var totalPrice = price;
  if (ratio)
    totalPrice = parseInt(price * ratio);
  return totalPrice;
}

function updatePrice() {
  var total = computePrice();
  $("#span-price").text(total);
}