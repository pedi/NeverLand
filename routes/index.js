var express = require("express");
var SubCategory = require("../models/SubCategory");
var Category = require("../models/Category");
var Banner = require("../models/Banner");
var Product = require("../models/Product");
var Fabric = require("../models/Fabric");
var Material = require("../models/Material");
var Downloadable = require("../models/Downloadable");
var NstudioProduct = require("../models/NstudioProduct");
var User = require("../models/User");
var Intro = require("../models/Intro");
var router = express.Router();
var admin = require("./admin/index");
var bCrypt = require("bcrypt-nodejs");
var _ = require("underscore");

module.exports = function(passport) {
  router.use(function(req, res, next) {
    console.log("request path", req.path);
    Category.find()
      .populate({ path: "subcategories" })
      .exec(function(err, categories) {
        if (!err) {
          res.locals.categories = categories;
          if (req.user) {
            res.locals.user = req.user;
          }
          next();
        } else {
          next(err);
        }
      });
  });

  //router.get("/create_admin", function(req, res,next) {
  //  var user = new User();
  //  user.username = "admin";
  //  user.password = bCrypt.hashSync("7T2b%U^%", bCrypt.genSaltSync(10), null);
  //  user.super_user = true;
  //  user.check_price = true;
  //  user.save(function(err, user) {
  //    if (!err) {
  //      res.end("new user generated successfully");
  //    } else {
  //      next(err);
  //    }
  //  })
  //});

  router.get("/login/", function(req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      res.redirect("/");
    } else {
      res.render("login");
    }
  });

  router.get("/logout/", function(req, res, next) {
    req.logout();
    res.redirect("/");
  });

  router.post(
    "/login/",
    passport.authenticate("login", {
      successRedirect: "/",
      failureRedirect: "/login/"
    })
  );

  router.use("/admin/", admin);

  /* GET home page. */
  router.get("/", function(req, res, next) {
    console.log(req.isAuthenticated());
    Banner.find().exec(function(error, banners) {
      res.render("index", { banners: banners });
    });
  });

  router.get("/contact/", function(req, res, next) {
    Intro.findOne({ type: "contact" }).exec(function(error, contact) {
      res.render("contact", { contact: contact });
    });
  });

  router.get("/about/", function(req, res, next) {
    Intro.findOne({ type: "about" }).exec(function(error, about) {
      res.render("about", { about: about });
    });
  });

  router.get("/download/", function(req, res, next) {
    Downloadable.find().exec(function(err, downloads) {
      if (err) {
        next(err);
      }
      downloads = _.sortBy(downloads, "name");
      res.render("downloads", { downloads: downloads });
    });
  });

  // router.get("/n_studio/:id/", function(req, res, next) {
  //   var id = req.params.id;
  //   NstudioProduct.findById(id, function(error, product) {
  //     if (!error && product) {
  //       res.render("nstudio_product", { product: product });
  //     } else {
  //       next(error);
  //     }
  //   });
  // });

  // router.get('/n_studio/', function(req, res, next) {
  //   NstudioProduct.find().exec(function(err, products) {
  //     if (err) {
  //       next(err);
  //     }
  //     products = _.sortBy(products, 'name');
  //     res.render("nstudio_products", {products : products});
  //   });
  // });

  // router.use(function(req, res, next) {
  //   if (req.isAuthenticated()) {
  //     next();
  //   } else {
  //     res.redirect("/login/");
  //   }
  // });

  router.get("/products/:id/", function(req, res, next) {
    var id = req.params.id;
    Product.findById(id, function(error, product) {
      if (!error && product) {
        // preprocess price groups
        var fabricGroup = [];
        var materialGroup = [];
        for (var i = 0; i < product.models.length; i++) {
          var model = product.models[i];
          if (model.fabrics_type && model.fabrics_price.length > 0) {
            model.fabrics = [];

            for (var j = 0; j < model.fabrics_type.length; j++) {
              model.fabrics.push({
                type: model.fabrics_type[j],
                price: model.fabrics_price[j]
              });
              if (model.fabrics_price[j] != -1) {
                fabricGroup.push(model.fabrics_type[j]);
              }
            }
            model.fabrics = JSON.stringify(model.fabrics);
            // get related model fabrics data
          } else if (model.material_type && model.material_price.length > 0) {
            model.materials = [];
            materialGroup = [];
            for (var j = 0; j < model.material_type.length; j++) {
              model.materials.push({
                type: model.material_type[j],
                price: model.material_price[j]
              });
              if (model.material_price[j] != -1) {
                materialGroup.push(model.material_type[j]);
              }
            }
            model.materials = JSON.stringify(model.materials);
            //res.render("product", {product : product});
            // get related model fabrics data
          }
        }
        // if a product is in sofa, chair, bedheads category, then need to show all fabrics and leathers
        SubCategory.findById(product.subcategory, function(error, subcategory) {
          if (
            ["Sofas", "Chairs", "Bedheads"].indexOf(subcategory.name) !== -1
          ) {
            Fabric.find({}).exec(function(error, fabrics) {
              if (error) {
                next(error);
              }
              var fabricGroups = _.groupBy(fabrics, function(fabric) {
                return fabric.type;
              });
              res.render("product", {
                product: product,
                fabricGroups: fabricGroups
              });
            });
          } else if (fabricGroup.length) {
            Fabric.find({
              price_group: { $in: fabricGroup }
            }).exec(function(error, fabrics) {
              if (!error) {
                var fabricGroups = _.groupBy(fabrics, function(fabric) {
                  return fabric.type;
                });
                res.render("product", {
                  product: product,
                  fabricGroups: fabricGroups
                });
              } else {
                next(error);
              }
            });
          } else if (materialGroup.length) {
            Material.find({
              price_group: { $in: materialGroup }
            }).exec(function(error, materials) {
              if (!error) {
                var materialGroups = _.groupBy(materials, function(material) {
                  return material.price_group;
                });
                res.render("product", {
                  product: product,
                  materialGroups: materialGroups
                });
              } else {
                next(error);
              }
            });
          } else {
            res.render("product", { product: product });
          }
        });
      } else {
        next(error);
      }
    });
  });

  router.get("/search/", function(req, res, next) {
    var query = req.query.keyword;
    if (query) {
      var re = new RegExp(query, "i");
      Product.find({
        name: re
      }).exec(function(err, products) {
        if (err) {
          next(err);
        } else {
          products = _.sortBy(products, "name");
          res.render("category", { products: products });
        }
      });
    }
  });

  router.get("/new_arrivals/", function(req, res, next) {
    Product.find({ new_arrival: true }).exec(function(err, products) {
      if (err) {
        next(err);
      }
      products = _.sortBy(products, "name");
      res.render("category", { products: products });
    });
  });

  router.get("/category/:sub_category_name/", function(req, res, next) {
    var categoryName = req.params.sub_category_name;
    if (categoryName) {
      SubCategory.findOne({ name: categoryName }).exec(function(
        err,
        subCategory
      ) {
        if (err) {
          next(new Error("category not found"));
        } else {
          Product.find({ subcategory: subCategory._id }).exec(function(
            err,
            products
          ) {
            products = _.sortBy(products, "name");
            res.render("category", { products: products });
          });
        }
      });
    } else {
      next(new Error("invalid category name"));
    }
  });
  return router;
};
