/**
 * Created by mohist on 8/23/15.
 */
var mongoose = require("mongoose");
var schema = new mongoose.Schema({
  //_id : {type: mongoose.Types.ObjectId, index : true},
  name : String,
  price_group : String,
  image : {
    path : String,
    content_type : String
  }
}, {
  autoIndex : false
});
var model = mongoose.model("Material", schema);
module.exports = model;