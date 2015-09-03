/**
 * Created by mohist on 9/3/15.
 */
var express = require("express");
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'images/contacts/' });
var Intro = require("../../models/Intro");

router.use(function(req, res, next) {
  Intro.findOrCreate({type : "contact"}, function(error, contact) {
    if (!error) {
      res.locals.contact = contact;
      next();
    } else {
      next(error);
    }
  });
});

router.get("/", function(req, res, next) {
  res.render("admin_contact");
});

router.post("/edit/", upload.array('images[]'), function(req, res, next) {
  var images = req.files;
  var contact = res.locals.contact;
  var banners = [];
  for (var i=0; i<images.length; i++) {
    contact.images.push({
      path : images[i].path,
      content_type : images[i].mimetype
    })
  }
  contact.content = req.body.content;
  contact.save(function(error, contact) {
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
  var contact = res.locals.contact;
  for (var i=0; i<contact.images.length; i++) {
    if (contact.images[i].path == path) {
      contact.images.pull(contact.images[i]._id);
    }
  }
  contact.save(function(error) {
    if (!error) {
      res.json({"success" : true});
    } else {
      next(error);
    }
  });
});

module.exports = router;