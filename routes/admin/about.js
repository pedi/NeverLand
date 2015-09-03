/**
 * Created by mohist on 9/3/15.
 */
var express = require("express");
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'images/about/' });
var Intro = require("../../models/Intro");

router.use(function(req, res, next) {
  Intro.findOrCreate({type : "about"}, function(error, about) {
    if (!error) {
      res.locals.about = about;
      next();
    } else {
      next(error);
    }
  });
});

router.get("/", function(req, res, next) {
  res.render("admin_about");
});

router.post("/edit/", upload.array('images[]'), function(req, res, next) {
  var images = req.files;
  var about = res.locals.about;
  var banners = [];
  for (var i=0; i<images.length; i++) {
    about.images.push({
      path : images[i].path,
      content_type : images[i].mimetype
    })
  }
  about.content = req.body.content;
  about.save(function(error, about) {
    if (!error) {
      res.json({
        success : true
      })
    } else {
      next(error);
    }
  });
});

router.post("/images/delete/", function(req, res, next) {
  var path = req.body.path;
  var about = res.locals.about;
  for (var i=0; i<about.images.length; i++) {
    if (about.images[i].path == path) {
      about.images.pull(about.images[i]._id);
    }
  }
  about.save(function(error) {
    if (!error) {
      res.json({"success" : true});
    } else {
      next(error);
    }
  });
});

module.exports = router;