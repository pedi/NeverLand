/**
 * Created by mohist on 9/1/15.
 */
var mongoose = require("mongoose");
var schema = new mongoose.Schema({
  image : {
    path : String,
    content_type : String
  }
}, {
  autoIndex : false
});
var model = mongoose.model("Banner", schema);
module.exports = model;