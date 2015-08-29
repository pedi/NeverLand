var express = require('express');
var SubCategory = require("../models/SubCategory");
var Category = require("../models/Category");
var Product = require("../models/Product");
var mongoose = require("mongoose");
//var formidable = require("formidable");
var multer  = require('multer');
var fs = require("fs");
var upload = multer({ dest: 'uploads/' });
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  Category.find().populate({path : "subcategories"}).exec(function(err, categories) {
    res.render('index', { categories : categories });
  });
});

router.get("/admin/products/add/", function(req, res, next) {
  Category.find().populate({path : "subcategories"}).exec(function(err, categories) {
    res.render('add_product', { categories : categories });
  });
});

var productUpload = upload.fields([
  { name: 'images[]', maxCount: 20 },
  { name: 'available_size_image', maxCount: 1 }
]);

router.post("/admin/products/add/", productUpload, function(req, res, next) {
  var product = new Product();
  product.name = req.body.name;
  product.category = mongoose.Schema.Types.ObjectId(req.body.catid);
  product.subcategory = mongoose.Schema.Types.ObjectId(req.body.sub_catid);
  var images = req.files["images[]"];
  for (var i=0; i<images.length; i++) {
    var rawImage = fs.readFileSync(images[i].path);
    product.images.push({
      data : rawImage,
      content_type : images[i].mimetype
    });
  }
  product.description = req.body.description;
  product.batch_ratio = parseFloat(req.body.price_group_ratio);
  product.batch_threshold = 7;
  product.delivery_time = parseInt(req.body.price_group_delivery);
  product.download_link = req.body.price_group_download;
  var availableSizeImage = req.files["available_size_image"];
  product.available_sizes_image = {
    data : fs.readFileSync(availableSizeImage[0].path),
    content_type : availableSizeImage[0].mimetype
  };

  if (req.body.price_group == "a") {
    // fabric types
    var price_groups = [
      ["price_group_lll", "lll"],
      ["price_group_ll", "ll"],
      ["price_group_l", "l"],
      ["price_group_m", "m"],
      ["price_group_h", "h"],
      ["price_group_hh", "hh"],
      ["price_group_hhh", "hhh"]
    ];
    for (var j=0; j<req.body['price_group_name'].length; j++) {
      var model = {
        name : req.body['price_group_name'][j],
        volume : parseFloat(req.body['price_group_volume'][j]),
        fabrics_type : [],
        fabrics_price : []
      };

      for (var k=0; k<price_groups.length; k++) {
        model.fabrics_type.push(price_groups[k][1]);
        var fabric = {
          type : price_groups[k][1],
        };
        var price = parseFloat(req.body[price_groups[k][0]][j]);
        if (!isNaN(price))
          model.fabrics_price.push(price);
        else
          model.fabrics_price.push(-1);
      }
      product.models.push(model)
    }
  } else if (req.body.price_group == "b") {
    // fabric types
    var price_groups = [
      ["price_group_oak", "oak"],
      ["price_group_elm", "elm"],
      ["price_group_pine", "pine"]
    ];
    for (var j=0; j<req.body['price_group_name'].length; j++) {
      var model = {
        name : req.body['price_group_name'][j],
        volume : parseFloat(req.body['price_group_volume'][j]),
        material_type : [],
        material_price : []
      };
      for (var k=0; k<price_groups.length; k++) {
        model.material_type.push(price_groups[k][1]);
        var fabric = {
          type : price_groups[k][1],
        };
        var price = parseFloat(req.body[price_groups[k][0]][j]);
        if (!isNaN(price))
          model.material_price.push(price);
        else
          model.material_price.push(-1);
      }
      product.models.push(model)
    }
  }
  product.save(function(err, product) {
    if (!err) {
      console.log(product);
      res.json(product);
    } else {
      next(err);
    }
  });
});

router.get("/category/:sub_category_name/", function(req, res, next) {
  var categoryName = req.params.sub_category_name;
  if (categoryName) {
    SubCategory.find({name : categoryName}).exec(function(err, subCategory) {
      if (err) {
        next(new Error("category not found"))
      } else {
        res.end(subCategory.toString());
      }
    })
  } else {
    next(new Error("invalid category name"))
  }
});

module.exports = router;
