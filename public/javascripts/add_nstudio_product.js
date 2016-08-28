/**
 * Created by mohist on 8/29/15.
 */
$(function() {
  initDom();
});

function initDom() {
  // set up multiple image upload preview
  $("#input-upload-images").on("change", function(e) {
    var files = e.target.files;
    if (files) {
      $("#upload-images-preview").empty();
      $.each(files, function(index, file) {
        if (file.size > 500000) {
          alert("each image cannot be more than 500Kb, please resize image first");
          return false;
        }
        var fileReader = new FileReader();
        fileReader.onload = function(e) {
          var src = e.target.result;
          var imageDom = new Image();
          imageDom.src = src;
          $("#upload-images-preview").append(imageDom);
        };
        fileReader.readAsDataURL(file);
      });
    }
  });

  $(".btn-delete-picture").on("click", function(e) {
    e.preventDefault();
    var btn = $(e.currentTarget);
    var path = btn.attr("data-image-path");
    var url = "/admin/nstudio_products/"+window.editProductId+"/images/delete/";
    $.post(url, {
      path : path
    }, function(e) {
      if (!e.error) {
        btn.closest(".col-xs-4").remove();
      } else {
        alert(e.error);
      }
    }).fail(function(e) {
      alert("delete image failed due to network error");
    })
  });

  // set up submit btn handler, post to server
  $("#btn-submit").on("click", function(e) {
    e.preventDefault();
    var formData = new FormData();
    var productName = $("#input-product-name").val();
    if (productName.trim() == "") {
      alert("please enter nstudio product name");
      return false;
    } else {
      formData.append("name", productName);
    }

    productName = $("#input-product-name-cn").val();
    if (productName.trim() == "") {
      alert("please enter nstudio product name in Chinese");
      return false;
    } else {
      formData.append("name_cn", productName);
    }


    var images = $("#input-upload-images")[0].files;
    if ((!images || images.length == 0) && !window.isEdit) {
      alert("please choose upload images");
      return false;
    } else {
      for (var i=0; i<images.length; i++) {
        formData.append("images[]", images[i], images[i].name);
      }
    }

    var description = $("#textarea-description").val().trim();
    if (!description) {
      alert("please enter description");
      return false;
    } else {
      formData.append("description", description);
    }
    description = $("#textarea-description-cn").val().trim();
    if (!description) {
      alert("please enter description in Chinese");
      return false;
    } else {
      formData.append("description_cn", description);
    }

    var url = "/admin/nstudio_products/add/";
    if (window.isEdit) {
      url = location.pathname;
      formData.append("product_id", window.editProductId);
    }
    // all ready, begin upload
    $.ajax({
      url : url,
      type : "POST",
      data : formData,
      contentType : false,
      cache : false,
      processData : false,
      success : function(e) {
        if (!e.error) {
          window.location.href = "/admin/nstudio_products/";
        } else {
          alert("failed to create new products, possible reason could be images files too large?");
        }
      }
    }).fail(function(e) {
      alert("failed to create new product");
    })
  })
}