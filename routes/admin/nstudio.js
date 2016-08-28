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
var NstudioProduct = require("../../models/NstudioProduct");
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
  NstudioProduct.find().exec(function(err, products) {
    if (!err) {
      products = _.sortBy(products, 'name');
      res.render("admin_nstudio", { products : products});
    } else {
      next(err);
    }
  })
});

router.get("/add/", function(req, res, next) {
  res.render('add_nstudio_product');
});


var productUpload = upload.fields([
  { name: 'images[]', maxCount: 20 },
]);

router.post("/add/", productUpload, function(req, res, next) {
  var product = new NstudioProduct();
  product.name = req.body.name;
  product.description = req.body.description;

  product.name_cn = req.body.name_cn;
  product.description_cn = req.body.description_cn;

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

  product.save(function(err, product) {
    if (!err) {
      res.json({
        "success" : true
      });
    } else {
      next(err);
    }
  });
});

router.post("/:id/edit", productUpload, function(req, res, next) {
  var data = req.body;
  var id = data.product_id;
  NstudioProduct.findById(id, function(error, product) {
    if (!error) {
      if (data.name)
        product.name = data.name;
      if (data.description)
        product.description = data.description;
      if (data.name_cn)
        product.name_cn = data.name_cn;
      if (data.description_cn)
        product.description_cn = data.description_cn;

      if (req.files["images[]"]) {
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
      }

      product.save(function(err, product) {
        if (!err) {
          res.json({
            "success" : true
          });
        } else {
          next(err);
        }
      });
    } else {
      next(error);
    }
  });
});

router.get("/:id/edit/", function(req, res, next) {
  var id = req.params.id;
  NstudioProduct.findById(id, function(error, product) {
    if (!error) {
      res.render('add_nstudio_product', { product : JSON.stringify(product), raw_product : product });
    } else {
      next(error);
    }
  })
});

router.post("/:id/images/delete/", function(req, res, next) {
  var id = req.params.id;
  var path = req.body.path;
  NstudioProduct.findById(id, function(error, product) {
    if (!error) {
      for (var i=0; i<product.images.length; i++) {
        console.log(product.images[i].path);
        console.log(path);
        if (product.images[i].path == path) {
          product.images.pull(product.images[i]._id);
        }
      }
      product.save(function(error) {
        if (!error) {
          res.json({"success" : true});
        } else {
          next(error);
        }
      });
    } else {
      next(error);
    }
  })
});

router.post("/:id/delete/", function(req, res, next) {
  var id = req.params.id;
  NstudioProduct.findByIdAndRemove(id, function(error) {
    if (!error) {
      res.json({"success" : true});
    } else {
      next(error);
    }
  })
});

module.exports = router;