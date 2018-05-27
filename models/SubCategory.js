/**
 * Created by mohist on 8/23/15.
 */
var mongoose = require("mongoose");
var schema = new mongoose.Schema(
  {
    //_id : {type: mongoose.Types.ObjectId, index : true},
    name: { type: String, unique: true },
    deleted: { type: Boolean }
  },
  {
    autoIndex: false
  }
);
var model = mongoose.model("SubCategory", schema);

module.exports = model;
