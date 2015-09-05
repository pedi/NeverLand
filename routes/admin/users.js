/**
 * Created by mohist on 9/5/15.
 */
var express = require("express");
var router = express.Router();

var User = require("../../models/User");

router.get("/", function(req, res, next) {
  User.find().exec(function(err, users) {
    if (!err) {
      res.render("admin_users", {users : users});
    } else {
      next(err);
    }
  });
});

router.post("/", function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var remark = req.body.remark;
  var price_access = false;
  if  (req.body.price_access)
    price_access = true;
  if (username && password) {
    var user = new User;
    user.username = username;
    user.password = password;
    user.remark = remark;
    user.check_price = price_access;
    user.save(function(err, user) {
      if (!err)
        res.redirect("./")
      else
        next(err);
    })
  } else {
    next(new Error("invalid user input"))
  }
});

router.post("/edit/", function(req, res, next) {
  User.findOne({
    _id : req.body.id
  }).exec(function(err, user) {
    if (!err) {
      if (user) {
        user.password = req.body.password;
        user.save(function(err, user) {
          if (!err) {
            res.json({
              success : true
            })
          } else {
            res.json({error : err})
          }
        });
      } else {
        next(new Error("user not found"));
      }
    } else {
      next(err);
    }
  });
});

router.post("/delete/", function(req, res, next) {
  console.log(req.body);
  User.findByIdAndRemove(req.body.id, function(err) {
    if (!err) {
      res.json({success : true});
    } else {
      res.json({error : err});
    }
  })
});

module.exports = router;