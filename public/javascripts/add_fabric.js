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
                    if (file.size > 500000) {
                        alert("each image cannot be more than 500Kb, please resize image first");
                        return false;
                    }
                    var fileReader = new FileReader();
                    fileReader.onload = function(e) {
                        var src = e.target.result;
                        var imageDom = new Image();
                        imageDom.src = src;
                        $(".fabrics-image-preview").append(imageDom);
                    };
                    fileReader.readAsDataURL(file);
                });
            }
        });

        $("#btn-add-new-fabric").on("click", function(e) {
            var formData = new FormData();
            var images = $("input[name=upload-image]")[0].files;
            if (!(images && images[0])) {
                alert("please choose fabric images");
                return false;
            } else {
                formData.append("image", images[0]);
            }
            var type = $("select[name=fabrics-type]").find(":selected").val();
            formData.append("type", type);
            var name = $("input[name=fabrics-name]").val();
            if (!name) {
                alert("please enter fabric name");
                return false;
            } else {
                formData.append("name", name);
            }
            var priceGroup = $("select[name=fabrics-price-group]").find(":selected").val();
            formData.append("price_group", priceGroup);

            // all ready, begin upload
            $.ajax({
                url : "/admin/fabrics/add/",
                type : "POST",
                data : formData,
                contentType : false,
                cache : false,
                processData : false,
                success : function(e) {
                    if (!e.error) {
                        window.location.href = "/admin/fabrics/";
                    } else {
                        alert("failed to create new fabrics");
                    }
                }
            }).fail(function(e) {
                alert("failed to create new fabric");
            })
        })
    }
})();
