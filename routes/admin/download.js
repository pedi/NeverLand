/**
 * Created by labs-suncc-mac on 20/8/16.
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
    if (file.mimetype == "application/pdf")
      cb(null, file.originalname);
    else
      cb(null, ''+Date.now())
  }
});
var upload = multer({
  storage : storage
});

var Downloadable = require("../../models/Downloadable");
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
  Downloadable.find().exec(function(err, downloads) {
    if (err) { next(err); }
    downloads = _.sortBy(downloads, 'name');
    res.render("admin_downloads", { downloads : downloads});
  })
});


var downloadUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'download_file', maxCount: 1 }
]);

router.post("/add/", downloadUpload, function(req, res, next) {
  var download = new Downloadable();
  download.name = req.body.name;
  var images = req.files["image"];

  var images_path_list = _.pluck(images, "path");
  if (images_path_list.length > 0) {
    compressAndResize(images_path_list);
    download.image = {
      path : images[0].path,
      content_type : images[0].mimetype
    };
  }

  var downloadFile = req.files['download_file'];
  if (downloadFile) {
    download.download_link = downloadFile[0].path;
  }
  download.save(function(err, download) {
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

router.post("/:id/delete/", function(req, res, next) {
  var id = req.params.id;
  Downloadable.findByIdAndRemove(id, function(error) {
    if (!error) {
      res.json({"success" : true});
    } else {
      next(error);
    }
  })
});

module.exports = router;