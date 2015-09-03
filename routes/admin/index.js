/**
 * Created by mohist on 9/1/15.
 */
var express = require("express");
var router = express.Router();
var multer  = require('multer');
var fs = require("fs");
var upload = multer({ dest: 'images/' });
var product = require("./product");
var fabrics = require("./fabrics");
var material = require("./material");
var banner = require("./banner");

router.use(function(req, res, next) {
  res.locals.is_admin = 1;
  next();
});

router.use("/products/", product);
router.use("/fabrics/", fabrics);
router.use("/materials/", material);
router.use("/banners/", banner);

module.exports = router;