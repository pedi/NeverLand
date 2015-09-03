var mongoose = require("mongoose");
var schema = new mongoose.Schema({
  path : String,
  content_type : String
});
module.exports = schema;