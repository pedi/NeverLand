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

  $("#select-category").on("change", function(e) {
    var subcat = $("#select-category").find(":selected").attr("data-subcategories");
    if (subcat) {
      subcat = JSON.parse(subcat);
      $("#select-sub-category").empty();
      for (var i=0; i<subcat.length; i++) {
        var option = document.createElement("option");
        option.value = subcat[i].id;
        option.innerHTML = subcat[i].name;
        $("#select-sub-category").append(option);
      }
    }
  });
  $("#select-category").trigger("change");


  $("#input-available-sizes").on("change", function(e) {
    var files = e.target.files;
    if (files && files[0]) {
      $("#available-sizes-preview").empty();
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
          $("#available-sizes-preview").append(imageDom);
        };
        fileReader.readAsDataURL(file);
      });
    }
  });

  // set up add a new row of price group input button handler
  $("#btn-add-price-group-a").on("click", function(e) {
    e.preventDefault();
    var template = $("#price-group-a-template").html();
    $("#price-group-a-wrapper").append(template);
  });
  $("#price-group-a-wrapper").on("click", ".btn-delete-price-group", function(e) {
    e.preventDefault();
    var btn = $(e.currentTarget);
    btn.closest(".price-group-a-row").remove();
  });

  // set up add a new row of price group input button handler
  $("#btn-add-price-group-b").on("click", function(e) {
    e.preventDefault();
    var template = $("#price-group-b-template").html();
    $("#price-group-b-wrapper").append(template);
  });
  $("#price-group-b-wrapper").on("click", ".btn-delete-price-group", function(e) {
    e.preventDefault();
    var btn = $(e.currentTarget);
    btn.closest(".price-group-b-row").remove();
  });

  // set up submit btn handler, post to server
  $("#btn-submit").on("click", function(e) {
    e.preventDefault();
    var formData = new FormData();
    var productName = $("#input-product-name").val();
    if (productName.trim() == "") {
      alert("please enter product name");
      return false;
    } else {
      formData.append("name", productName);
    }

    var productCategory = $("#select-category").find(":selected");
    var productCategoryId = -1;
    if (!productCategory) {
      alert("please select category");
      return false;
    } else {
      productCategoryId = productCategory.val();
      formData.append("cat_id", productCategoryId);
    }

    var subProductCategory = $("#select-sub-category").find(":selected");
    var subProductCategoryId = -1;
    if (!subProductCategory) {
      alert("please select subcategory");
      return false;
    } else {
      subProductCategoryId = subProductCategory.val();
      formData.append("sub_cat_id", subProductCategoryId);
    }

    var images = $("#input-upload-images")[0].files;
    if (!images || images.length == 0) {
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

    // price group related
    var chooseGroupA = $("#checkbox-fabrics")[0].checked;
    var chooseGroupB = $("#checkbox-material")[0].checked;
    if (!chooseGroupA && !chooseGroupB) {
      //alert("please select a price group type (A or B)");
      //return false;
      // no longer compulsory
    } else if (chooseGroupA && chooseGroupB) {
      alert("please select only one price group, not both");
      return false;
    }
    if (chooseGroupA) {
      var priceGroups = $("#price-group-a-wrapper .price-group-row");
      if (priceGroups.length == 0) {
        alert("please at least add one size row in price group A");
        return false;
      }
      for (var i=0; i<priceGroups.length; i++) {
        var priceGroup = $(priceGroups[i]);
        var modelName = priceGroup.find(".input-model-name").val().trim();
        if (!modelName) {
          alert("model name is compulsory. please check any missing model name");
          return false;
        }
        var volume = priceGroup.find(".input-volume").val().trim();
        if (!volume) {
          alert("volume is compulsory, please check any missing volume input");
          return false;
        } else if (!$.isNumeric(volume)) {
          alert("volume must be numeric");
          return false;
        }
        formData.append("price_group_name[]", modelName);
        formData.append("price_group_volume[]", volume);
        formData.append("price_group_lll[]", priceGroup.find(".input-price-lll").val().trim());
        formData.append("price_group_ll[]", priceGroup.find(".input-price-ll").val().trim());
        formData.append("price_group_l[]", priceGroup.find(".input-price-l").val().trim());
        formData.append("price_group_m[]", priceGroup.find(".input-price-m").val().trim());
        formData.append("price_group_h[]", priceGroup.find(".input-price-h").val().trim());
        formData.append("price_group_hh[]", priceGroup.find(".input-price-hh").val().trim());
        formData.append("price_group_hhh[]", priceGroup.find(".input-price-hhh").val().trim());
      }
      var priceRatio = $("#price-group-a input[name=input-price-ratio]").val().trim();
      if (!priceRatio) {
        alert("price ratio for large volumes is compulsory, please enter");
        return false;
      }
      var deliveryTime = $("#price-group-a input[name=input-delivery-time]").val().trim();
      if (!deliveryTime) {
        alert("please enter delivery time");
        return false;
      }
      var downloadFile = $("#price-group-a input[name=input-download-link]")[0].files;
      if (!(downloadFile && downloadFile[0])) {
        alert("please provide download file");
        return false;
      }
      formData.append("price_group", "a");
      formData.append("price_group_ratio", priceRatio);
      formData.append("price_group_delivery", deliveryTime);
      formData.append("download_file", downloadFile[0]);
    } else {
      // choose price group b
      var priceGroups = $("#price-group-b-wrapper .price-group-row");
      if (priceGroups.length == 0) {
        alert("please at least add one size row in price group B");
        return false;
      }
      for (var i = 0; i < priceGroups.length; i++) {
        var priceGroup = $(priceGroups[i]);
        var modelName = priceGroup.find(".input-model-name").val().trim();
        if (!modelName) {
          alert("model name is compulsory. please check any missing model name");
          return false;
        }
        var volume = priceGroup.find(".input-volume").val().trim();
        if (!volume) {
          alert("volume is compulsory, please check any missing volume input");
          return false;
        } else if (!$.isNumeric(volume)) {
          alert("volume must be numeric");
          return false;
        }

        formData.append("price_group_name[]", modelName);
        formData.append("price_group_volume[]", volume);
        formData.append("price_group_oak[]", priceGroup.find(".input-price-oak").val().trim());
        formData.append("price_group_elm[]", priceGroup.find(".input-price-elm").val().trim());
        formData.append("price_group_pine[]", priceGroup.find(".input-price-pine").val().trim());
      }
      var priceRatio = $("#price-group-b input[name=input-price-ratio]").val().trim();
      if (!priceRatio) {
        alert("price ratio for large volumes is compulsory, please enter");
        return false;
      }
      var deliveryTime = $("#price-group-b input[name=input-delivery-time]").val().trim();
      if (!deliveryTime) {
        alert("please enter delivery time");
        return false;
      }
      var downloadFile = $("#price-group-b input[name=input-download-link]")[0].files;
      if (!(downloadFile && downloadFile[0])) {
        alert("please provide download file");
        return false;
      }
      formData.append("price_group", "b");
      formData.append("price_group_ratio", priceRatio);
      formData.append("price_group_delivery", deliveryTime);
      formData.append("download_file", downloadFile[0]);
    }

    // available sizes
    var files = $("#input-available-sizes")[0].files;
    if (!(files && files[0])) {
      //alert("please upload available size image");
      //return false;
      // no longer compulsory
    } else {
      formData.append("available_size_image", files[0]);
    }

     // all ready, begin upload
    $.ajax({
      url : "/admin/products/add/",
      type : "POST",
      data : formData,
      contentType : false,
      cache : false,
      processData : false,
      success : function(e) {
        if (!e.error) {
          window.location.href = "/admin/products/";
        } else {
          alert("failed to create new products, possible reason could be images files too large?");
        }
      }
    }).fail(function(e) {
      alert("failed to create new product");
    })
  })
}