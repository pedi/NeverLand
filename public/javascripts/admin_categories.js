$(function () {
  $("#form-add-category").on("submit", function (e) {
    e.preventDefault();
    var form = $(this);
    $.post("/admin/categories/add/", {
      name: form.find('[name="name"]').val(),
      displayName: form.find('[name="displayName"]').val()
    }, function () {
      location.reload();
    }).fail(function () {
      alert("Failed to add category");
    });
  });

  $(".btn-edit-category").on("click", function () {
    var panel = $(this).closest(".category-panel");
    panel.find(".category-display").hide();
    panel.find(".category-edit-form").show();
  });

  $(".btn-cancel-edit").on("click", function () {
    var panel = $(this).closest(".category-panel");
    panel.find(".category-edit-form").hide();
    panel.find(".category-display").show();
  });

  $(".form-rename-category").on("submit", function (e) {
    e.preventDefault();
    var form = $(this);
    var panel = form.closest(".category-panel");
    var id = panel.data("category-id");
    $.post("/admin/categories/" + id + "/update/", {
      name: form.find(".input-cat-name").val(),
      displayName: form.find(".input-cat-display").val()
    }, function () {
      location.reload();
    }).fail(function () {
      alert("Failed to update category");
    });
  });

  $(".btn-toggle-category").on("click", function () {
    var panel = $(this).closest(".category-panel");
    var id = panel.data("category-id");
    $.post("/admin/categories/" + id + "/toggle-delete/", function () {
      location.reload();
    }).fail(function () {
      alert("Failed to toggle category");
    });
  });

  $(".btn-rename-sub").on("click", function () {
    var row = $(this).closest(".subcategory-row");
    var panel = row.closest(".category-panel");
    var catId = panel.data("category-id");
    var subId = row.data("sub-id");
    var newName = prompt("New subcategory name:", row.find(".sub-name").text());
    if (!newName) return;
    $.post("/admin/categories/" + catId + "/subcategories/" + subId + "/rename/", {
      name: newName
    }, function () {
      location.reload();
    }).fail(function () {
      alert("Failed to rename subcategory");
    });
  });

  $(".btn-toggle-sub").on("click", function () {
    var row = $(this).closest(".subcategory-row");
    var panel = row.closest(".category-panel");
    var catId = panel.data("category-id");
    var subId = row.data("sub-id");
    $.post("/admin/categories/" + catId + "/subcategories/" + subId + "/toggle-delete/", function () {
      location.reload();
    }).fail(function () {
      alert("Failed to toggle subcategory");
    });
  });

  $(".form-add-sub").on("submit", function (e) {
    e.preventDefault();
    var form = $(this);
    var panel = form.closest(".category-panel");
    var catId = panel.data("category-id");
    var name = form.find('[name="subName"]').val();
    if (!name) return;
    $.post("/admin/categories/" + catId + "/subcategories/add/", {
      name: name
    }, function () {
      location.reload();
    }).fail(function () {
      alert("Failed to add subcategory");
    });
  });
});
