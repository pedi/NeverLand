/**
 * Created by mohist on 9/1/15.
 */
var express = require("express");
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'images/' });
var Banner = require("../../models/Banner");

router.get("/", function(req, res, next) {
  Banner.find().exec(function(error, banners) {
    if (!error) {
      res.render("add_banner", {
        banners : banners
      });
    } else {
      next(error);
    }
  })
});

router.post("/add/", upload.array('images[]'), function(req, res, next) {
  var images = req.files;
  var banners = [];
  for (var i=0; i<images.length; i++) {
    banners.push({
      image : {
        path : images[i].path,
        content_type : images[i].mimetype
      }
    })
  }
  Banner.create(banners, function(error, banners) {
    if (!error) {
      res.json({
        success : true
      })
    } else {
      next(error);
    }
  });
});

router.post("/:id/delete/", function(req, res, next) {
  var id = req.params.id;
  Banner.findByIdAndRemove(id, function(error) {
    if (!error) {
      res.json({"success" : true});
    } else {
      next(error);
    }
  })
});

module.exports = router;