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
                        $(".fabrics-image-preview").append(imageDom);
                    };
                    fileReader.readAsDataURL(file);
                });
            }
        });
    }
})();
