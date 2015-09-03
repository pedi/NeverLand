/**
 * Created by mohist on 9/3/15.
 */
var mongoose = require("mongoose");
var findOrCreate = require('mongoose-findorcreate');
var ImageSchema = require("./Image");
var schema = new mongoose.Schema({
  type : {type : String, unique : true},
  content : String,
  images : [ImageSchema]
}, {
  autoIndex : false
});
schema.plugin(findOrCreate);
var model = mongoose.model("Intro", schema);
module.exports = model;