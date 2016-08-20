var mongoose = require("mongoose");
var schema = new mongoose.Schema({
  image : {
    path : String,
    content_type : String
  },
  name: String,
  download_link : String,
}, {
  autoIndex : false
});
var model = mongoose.model("Downloadable", schema);
module.exports = model;