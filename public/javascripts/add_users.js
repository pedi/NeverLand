/**
 * Created by mohist on 9/5/15.
 */
$(function() {
  $(".btn-edit").on("click", function(e) {
    var id = $(e.currentTarget).closest(".form-group").attr("data-user-id");
    var password = $(e.currentTarget).closest(".form-group")
      .find("input.password").val();

    $.post("/admin/users/edit/", {
      id : id,
      password : password
    }, function(e) {
      if (!e.error) {
        location.reload();
      } else {
        alert(e.error);
      }
    }).fail(function(e) {
      alert("server error");
    })
  });
  $(".btn-delete").on("click", function(e) {
    var id = $(e.currentTarget).closest(".form-group").attr("data-user-id");
    $.post("/admin/users/delete/", {
      id : id
    }, function(e) {
      if (!e.error) {
        location.reload();
      } else {
        alert(e.error);
      }
    }).fail(function(e) {
      alert("server error");
    })
  })
});