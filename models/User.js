/**
 * Created by mohist on 9/5/15.
 */
var mongoose = require("mongoose");
var bCrypt = require('bcrypt-nodejs');
var schema = new mongoose.Schema({
  username : {type : String, unique : true},
  password : String,
  remark : String,
  super_user : Boolean,
  check_price : Boolean
}, {
  autoIndex : false
});
var model = mongoose.model("User", schema);
module.exports = model;

function generateAdminUser() {
  var user = new User();
  user.username = "admin";
  user.password = bCrypt.hashSync("7T2b%U^%");
  user.super_user = true;
  user.check_price = true;
  user.save(function(err, user) {
    if (!err) {
      res.end("new user generated successfully");
    }
  })
}