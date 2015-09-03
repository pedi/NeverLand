var express = require('express');
var SubCategory = require("../models/SubCategory");
var Category = require("../models/Category");
var Banner = require("../models/Banner");
var Product = require("../models/Product");
var Fabric = require("../models/Fabric");
var Intro = require("../models/Intro");
var router = express.Router();
var admin = require("./admin/index");

var _ = require("underscore");

router.use(function(req, res, next) {
  Category.find().populate({path : "subcategories"}).exec(function(err, categories) {
    if (!err) {
      res.locals.categories = categories;
      next();
    } else {
      next(err);
    }
  });
});

router.use("/admin/", admin);

/* GET home page. */
router.get('/', function(req, res, next) {
  Banner.find().exec(function(error, banners) {
    res.render('index', {banners : banners});
  });
});

router.get('/contact/', function(req, res, next) {
  Intro.findOne({type : "contact"}).exec(function(error, contact) {
    res.render('contact', {contact : contact});
  });
});

router.get('/about/', function(req, res, next) {
  Intro.findOne({type : "about"}).exec(function(error, about) {
    res.render('about', {about : about});
  });
});


router.get("/products/:id/", function(req, res, next) {
  var id = req.params.id;
  Product.findById(id, function(error, product) {
    if (!error) {
      // preprocess price groups
      for (var i=0; i<product.models.length; i++) {
        var model = product.models[i];
        if (model.fabrics_type && model.fabrics_price.length > 0) {
          model.fabrics = [];
          var fabricGroup = [];
          for (var j=0; j<model.fabrics_type.length; j++) {
            model.fabrics.push({type : model.fabrics_type[j], price : model.fabrics_price[j]});
            if (model.fabrics_price[j] != -1) {
              fabricGroup.push(model.fabrics_type[j]);
            }
          }
          model.fabrics = JSON.stringify(model.fabrics);
          // get related model fabrics data
          Fabric.find({
            price_group : { $in : fabricGroup}
          }).exec(function(error, fabrics) {
            if (!error) {
              var fabricGroups = _.groupBy(fabrics, function(fabric) {
                return fabric.type;
              });
              res.render("product", {product : product, fabricGroups:fabricGroups});
            } else {next(error);}
          })
        }
        if (model.material_type && model.material_price.length > 0) {
          model.materials = [];
          var materialGroup = [];
          for (var j=0; j<model.material_type.length; j++) {
            model.materials.push({type : model.material_type[j], price : model.material_price[j]});
            if (model.material_price[j] != -1) {
              materialGroup.push(model.material_type[j]);
            }
          }
          model.materials = JSON.stringify(model.materials);
          //res.render("product", {product : product});
          // get related model fabrics data
          Material.find({
            price_group : { $in : materialGroup}
          }).exec(function(error, materials) {
            if (!error) {
              var materialGroups = _.groupBy(materials, function(material) {
                return material.price_group;
              });
              res.render("product", {product : product, materialGroups:materialGroups});
            } else {next(error);}
          })
        }
      }
    } else {
      next(error);
    }
  })
});

router.get("/category/:sub_category_name/", function(req, res, next) {
  var categoryName = req.params.sub_category_name;
  if (categoryName) {
    SubCategory.findOne({name : categoryName}).exec(function(err, subCategory) {
      if (err) {
        next(new Error("category not found"))
      } else {
        Product.find({subcategory : subCategory._id}).exec(function(err, products) {
          res.render("category", {products : products});
        });
      }
    })
  } else {
    next(new Error("invalid category name"))
  }
});

module.exports = router;
