/**
 * Created by mohist on 8/31/15.
 */
/**
 * Created by pedi on 8/31/15.
 */
(function() {
  $(function() {
    initDom();
  });

  function initDom() {
    $("input[name=upload-image]").on("change", function(e) {
      var files = e.target.files;
      if (files && files[0]) {
        $(".fabrics-image-preview").empty();
        $.each(files, function(index, file) {
          var fileReader = new FileReader();
          fileReader.onload = function(e) {
            var src = e.target.result;
            var imageDom = new Image();
            imageDom.src = src;
            $(".material-image-preview").append(imageDom);
          };
          fileReader.readAsDataURL(file);
        });
      }
    });

    $("#btn-add-new-material").on("click", function(e) {
      var formData = new FormData();
      var images = $("input[name=upload-image]")[0].files;
      if (!(images && images[0])) {
        alert("please choose fabric images");
        return false;
      } else {
        formData.append("image", images[0]);
      }
      var name = $("input[name=material-name]").val();
      if (!name) {
        alert("please enter fabric name");
        return false;
      } else {
        formData.append("name", name);
      }
      var priceGroup = $("select[name=material-price-group]").find(":selected").val();
      formData.append("price_group", priceGroup);

      // all ready, begin upload
      $.ajax({
        url : "/admin/materials/add/",
        type : "POST",
        data : formData,
        contentType : false,
        cache : false,
        processData : false,
        success : function(e) {
          if (!e.error) {
            window.location.href = "/admin/materials/";
          } else {
            alert("failed to create new material");
          }
        }
      }).fail(function(e) {
        alert("failed to create new material");
      })
    })
  }
})();
