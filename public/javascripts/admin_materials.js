/**
 * Created by mohist on 8/31/15.
 */
$(function() {
  initDom();
});

function initDom() {
  $(".btn-delete-material").on("click", function(e) {
    e.preventDefault();
    var btn = $(e.currentTarget);
    var materialId = btn.closest(".material-card-wrapper").attr("data-material-id");
    var url = "/materials/"+materialId+"/delete/";
    $.post(url, function(e) {
      if (!e.error) {
        btn.closest(".material-card-wrapper").remove();
      } else {
        alert(e.error);
      }
    }).fail(function(e) {
      alert("delete products failed due to network error");
    })
  })
}