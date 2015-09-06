/**
 * Created by mohist on 9/1/15.
 */
var express = require("express");
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'images/' });
var _ = require("underscore");
var Material = require("../../models/Material");

router.get("/", function(req, res, next) {
  Material.find().exec(function(error, materials) {
    if (!error) {
      materials = _.sortBy(materials, 'name');
      var materialGroups = _.groupBy(materials, function(materials) {
        return materials.price_group;
      });
      res.render("admin_materials", {
        materialGroups : materialGroups
      });
    } else {
      next(error);
    }
  })
});

router.get("/add/", function(req, res, next) {
  res.render("add_material", {});
});

router.post("/add/", upload.single('image'), function(req, res, next) {
  var image = req.file;
  var material = new Material();
  material.name = req.body.name;
  material.price_group = req.body.price_group;
  material.image = {
    path : image.path,
    content_type : image.mimetype
  };
  material.save(function(error, material) {
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
  Material.findByIdAndRemove(id, function(error) {
    if (!error) {
      res.json({"success" : true});
    } else {
      next(error);
    }
  })
});

module.exports = router;