/**
 * Created by mohist on 8/30/15.
 */
$(function() {
  initDom();
});

function initDom() {
  $(".btn-delete-product").on("click", function(e) {
    e.preventDefault();
    var btn = $(e.currentTarget);
    var productId = btn.closest(".product-wrapper").attr("data-product-id");
    var url = "/admin/products/"+productId+"/delete/";
    $.post(url, function(e) {
      if (!e.error) {
        btn.closest(".product-wrapper").remove();
      } else {
        alert(e.error);
      }
    }).fail(function(e) {
        alert("delete products failed due to network error");
    })
  })
}