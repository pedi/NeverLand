var express = require('express');
var SubCategory = require("../models/SubCategory");
var Category = require("../models/Category");
var mongoose = require("mongoose");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  Category.find().populate({path : "subcategories"}).exec(function(err, categories) {
    res.render('index', { categories : categories });
  });

});

router.get("/admin/products/add", function(req, res, next) {
  res.render('add_product', {cache : false});
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
