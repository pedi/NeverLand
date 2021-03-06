(function() {
  $(function() {
    initDom();
  });

  function initDom() {
    $("input[name=upload-images]").on("change", function(e) {
      var files = e.target.files;
      if (files && files[0]) {
        $(".download-image-preview").empty();
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
            imageDom.className = "col-xs-4";
            $(".download-image-preview").append(imageDom);
          };
          fileReader.readAsDataURL(file);
        });
      }
    });

    $(".btn-delete-download").on("click", function(e) {
      e.preventDefault();
      var btn = $(e.currentTarget);
      var bannerId = btn.attr("data-download-id");
      var url = "/admin/downloads/"+bannerId+"/delete/";
      $.post(url, function(e) {
        if (!e.error) {
          btn.closest(".download-wrapper").remove();
        } else {
          alert(e.error);
        }
      }).fail(function(e) {
        alert("delete download failed due to network error");
      })
    });

    $("#btn-add-new-download").on("click", function(e) {
      var formData = new FormData();
      var images = $("input[name=upload-images]")[0].files;
      if (!images || images.length == 0) {
        alert("please choose banner images");
        return false;
      } else {
        formData.append("image", images[0], images[0].name);
      }

      var downloadFile = $("input[name=upload-file]")[0].files;
      if (!(downloadFile && downloadFile[0])) {
        alert("please provide download file");
        return false;
      }
      formData.append("download_file", downloadFile[0]);

      var name = $("input#input-download-name").val();
      if (!name) {
        alert("Please enter download name");
        return false;
      }
      formData.append("name", name);

      // all ready, begin upload
      $.ajax({
        url : "/admin/downloads/add/",
        type : "POST",
        data : formData,
        contentType : false,
        cache : false,
        processData : false,
        success : function(e) {
          if (!e.error) {
            location.reload();
          } else {
            alert("failed to create new download");
          }
        }
      }).fail(function(e) {
        alert("failed to create new download");
      })
    })
  }
})();
