var mongoose = require("mongoose");
var schema = new mongoose.Schema({
  name : String,
  description : String,
  name_cn: String,
  description_cn: String,
  images : [{
    path : String,
    content_type : String
  }],
}, {
  autoIndex : false
});
var model = mongoose.model("NstudioProduct", schema);

module.exports = model;