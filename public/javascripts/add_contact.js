/**
 * Created by mohist on 9/1/15.
 */
(function() {
  $(function() {
    initDom();
  });

  function initDom() {
    $("input[name=upload-images]").on("change", function(e) {
      var files = e.target.files;
      if (files && files[0]) {
        $(".banners-image-preview").empty();
        $.each(files, function(index, file) {
          var fileReader = new FileReader();
          fileReader.onload = function(e) {
            var src = e.target.result;
            var imageDom = new Image();
            imageDom.src = src;
            imageDom.className = "col-xs-4";
            $(".banners-image-preview").append(imageDom);
          };
          fileReader.readAsDataURL(file);
        });
      }
    });

    $(".btn-delete-banner").on("click", function(e) {
      e.preventDefault();
      var btn = $(e.currentTarget);
      var path = btn.attr("data-banner-path");
      var url = "/admin/contact/images/delete/";
      $.post(url, {
        path : path
      }, function(e) {
        if (!e.error) {
          btn.closest(".banner-wrapper").remove();
        } else {
          alert(e.error);
        }
      }).fail(function(e) {
        alert("delete banner failed due to network error");
      })
    });

    $("#btn-add-new-banners").on("click", function(e) {
      var formData = new FormData();
      var images = $("input[name=upload-images]")[0].files;
      if (!images || images.length == 0) {
        //alert("please choose banner images");
        //return false;
      } else {
        for (var i=0; i<images.length; i++) {
          formData.append("images[]", images[i], images[i].name);
        }
      }
      formData.append("content", $("textarea[name=description]").val());
      // all ready, begin upload
      $.ajax({
        url : "/admin/contact/edit/",
        type : "POST",
        data : formData,
        contentType : false,
        cache : false,
        processData : false,
        success : function(e) {
          if (!e.error) {
            location.reload();
          } else {
            alert("failed to　edit contact");
          }
        }
      }).fail(function(e) {
        alert("failed to edit contact");
      })
    })
  }
})();
