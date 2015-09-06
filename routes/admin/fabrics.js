/**
 * Created by mohist on 9/1/15.
 */
var express = require("express");
var router = express.Router();
var multer  = require('multer');
var _ = require("underscore");
var upload = multer({ dest: 'images/' });
var Fabric = require("../../models/Fabric");

router.get("/", function(req, res, next) {
  Fabric.find().exec(function(error, fabrics) {
    if (!error) {
      fabrics = _.sortBy(fabrics, 'name');
      var fabricGroups = _.groupBy(fabrics, function(fabric) {
        return fabric.type;
      });
      res.render("admin_fabrics", {
        fabricGroups : fabricGroups
      });
    } else {
      next(error);
    }

  })
});

router.get("/add/", function(req, res, next) {
  res.render("add_fabric", {});
});

router.post("/add/", upload.single('image'), function(req, res, next) {
  var image = req.file;
  var fabric = new Fabric();
  fabric.name = req.body.name;
  fabric.price_group = req.body.price_group;
  fabric.type = req.body.type;
  fabric.image = {
    path : image.path,
    content_type : image.mimetype
  };
  fabric.save(function(error, fabric) {
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
  Fabric.findByIdAndRemove(id, function(error) {
    if (!error) {
      res.json({"success" : true});
    } else {
      next(error);
    }
  })
});

module.exports = router;