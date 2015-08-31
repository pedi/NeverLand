var express = require('express');
var SubCategory = require("../models/SubCategory");
var Category = require("../models/Category");
var Product = require("../models/Product");
var Fabric = require("../models/Fabric");
var mongoose = require("mongoose");
//var formidable = require("formidable");
var multer  = require('multer');
var fs = require("fs");
var upload = multer({ dest: 'images/' });
var router = express.Router();
var _ = require("underscore");

/* GET home page. */
router.get('/', function(req, res, next) {
  Category.find().populate({path : "subcategories"}).exec(function(err, categories) {
    res.render('index', { categories : categories });
  });
});

router.get("/admin/products/", function(req, res, next) {
  Product.find().exec(function(err, products) {
    if (!err) {
      res.render("admin_products", { products : products});
    } else {
      next(err);
    }
  })
});

router.get("/admin/products/add/", function(req, res, next) {
  Category.find().populate({path : "subcategories"}).exec(function(err, categories) {
    // preprocess categories
    for (var i=0; i<categories.length; i++) {
      var category = categories[i];
      category.subcat = [];
      for (var j=0; j<category.subcategories.length; j++) {
        var subcat = category.subcategories[j];
        category.subcat.push({
          id : subcat._id,
          name : subcat.name
        })
      }
      category.subcat= JSON.stringify(category.subcat);
    }
    res.render('add_product', { categories : categories });
  });
});

router.post("/products/:id/delete/", function(req, res, next) {
  var id = req.params.id;
  Product.findByIdAndRemove(id, function(error) {
    if (!error) {
      res.json({"success" : true});
    } else {
      next(error);
    }
  })
});

router.get("/products/:id/", function(req, res, next) {
  var id = req.params.id;
  Product.findById(id, function(error, product) {
    if (!error) {
      // preprocess price groups
      for (var i=0; i<product.models.length; i++) {
        var model = product.models[i];
        model.fabrics = [];
        if (model.fabrics_type) {
          for (var j=0; j<model.fabrics_type.length; j++) {
            model.fabrics.push({type : model.fabrics_type[j], price : model.fabrics_price[j]});
          }
          model.fabrics = JSON.stringify(model.fabrics);
        }
        if (model.material_type) {
          for (var j=0; j<model.material_type.length; j++) {
            model.materials.push({type : model.material_type[j], price : model.material_price[j]});
          }
          model.materials = JSON.stringify(model.materials);
        }
      }
      res.render("product", {product : product});
    } else {
      next(error);
    }
  })
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
    product.images.push({
      path : images[i].path,
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
    path : availableSizeImage[0].path,
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
          type : price_groups[k][1]
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
      res.json({
        "success" : true
      });
    } else {
      next(err);
    }
  });
});

router.get("/admin/fabrics/", function(req, res, next) {
  Fabric.find().exec(function(error, fabrics) {
    if (!error) {
      var fabricsByType = _.groupBy(fabrics, function(fabric) {
        return fabric.type;
      });
      res.render("admin_fabrics", {});
    } else {
      next(error);
    }

  })
});

router.get("/admin/fabrics/add/", function(req, res, next) {
  res.render("add_fabric", {});
});

router.post("/admin/fabrics/add/", upload.single('image'), function(req, res, next) {
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
