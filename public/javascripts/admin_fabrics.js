/**
 * Created by mohist on 8/31/15.
 */
$(function() {
  initDom();
});

function initDom() {
  $(".btn-delete-fabric").on("click", function(e) {
    e.preventDefault();
    var btn = $(e.currentTarget);
    var fabricId = btn.closest(".fabric-card-wrapper").attr("data-fabric-id");
    var url = "/admin/fabrics/"+fabricId+"/delete/";
    $.post(url, function(e) {
      if (!e.error) {
        btn.closest(".fabric-card-wrapper").remove();
      } else {
        alert(e.error);
      }
    }).fail(function(e) {
      alert("delete products failed due to network error");
    })
  })
}