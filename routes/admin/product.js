/**
 * Created by mohist on 9/1/15.
 */
var express = require("express");
var router = express.Router();
var multer  = require('multer');
var mongoose = require("mongoose");
var fs = require("fs");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/')
  },
  filename: function (req, file, cb) {
    console.log("file type is");
    console.log(file);
    if (file.mimetype == "application/vnd.ms-excel")
      cb(null, file.originalname);
    else if (file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      cb(null, file.originalname);
    else
      cb(null, ''+Date.now())
  }
});
var upload = multer({
  storage : storage
});
var Product = require("../../models/Product");
var Category = require("../../models/Category");
var path = require("path");
var resize = path.resolve(__dirname, "../../helpers/image_resize.js");
var _ = require("underscore");

function compressAndResize(imageUrl) {
  // We need to spawn a child process so that we do not block
  // the EventLoop with cpu intensive image manipulation
  var childProcess = require('child_process').fork(resize);
  childProcess.on('message', function(message) {
    console.log(message);
  });
  childProcess.on('error', function(error) {
    console.error(error.stack)
  });
  childProcess.on('exit', function() {
    console.log('process exited');
  });
  childProcess.send(imageUrl);
}

router.get("/", function(req, res, next) {
  Product.find().exec(function(err, products) {
    if (!err) {
      products = _.sortBy(products, 'name');
      res.render("admin_products", { products : products});
    } else {
      next(err);
    }
  })
});

router.get("/add/", function(req, res, next) {
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


var productUpload = upload.fields([
  { name: 'images[]', maxCount: 20 },
  { name: 'available_size_image', maxCount: 1 },
  { name: 'download_file', maxCount: 1 }
]);

router.post("/add/", productUpload, function(req, res, next) {
  var product = new Product();
  product.name = req.body.name;
  product.category = new mongoose.Types.ObjectId(req.body.cat_id);
  product.subcategory = new mongoose.Types.ObjectId(req.body.sub_cat_id);
  var images = req.files["images[]"];

  var images_path_list = _.pluck(images, "path");
  if (images_path_list.length > 0)
    compressAndResize(images_path_list);

  for (var i=0; i<images.length; i++) {
    product.images.push({
      path : images[i].path,
      content_type : images[i].mimetype
    });
  }
  product.description = req.body.description;
  product.batch_ratio = parseFloat(req.body.price_group_ratio);
  product.batch_threshold = 10;
  product.delivery_time = parseInt(req.body.price_group_delivery);
  //product.download_link = req.body.price_group_download;
  var availableSizeImage = req.files["available_size_image"];
  if (availableSizeImage) {
    product.available_sizes_image = {
      path : availableSizeImage[0].path,
      content_type : availableSizeImage[0].mimetype
    };
  }
  var downloadFile = req.files['download_file'];
  if (downloadFile) {
    product.download_link = downloadFile[0].path;
  }

  if (req.body.price_group == "a") {
    // fabric types
    var price_groups = [
      ["price_group_lll", "LLL"],
      ["price_group_ll", "LL"],
      ["price_group_l", "L"],
      ["price_group_m", "M"],
      ["price_group_h", "H"],
      ["price_group_hh", "HH"],
      ["price_group_hhh", "HHH"]
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
      //console.log(product);
      res.json({
        "success" : true
      });
    } else {
      next(err);
    }
  });
});

router.get("/:id/edit/", function(req, res, next) {
  var id = req.params.id;
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
    Product.findById(id, function(error, product) {
      if (!error) {
        res.render('add_product', { categories : categories, product : product });
      } else {
        next(error);
      }
    })

  });
});

router.post("/:id/delete/", function(req, res, next) {
  var id = req.params.id;
  Product.findByIdAndRemove(id, function(error) {
    if (!error) {
      res.json({"success" : true});
    } else {
      next(error);
    }
  })
});

module.exports = router;