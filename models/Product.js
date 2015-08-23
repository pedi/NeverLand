/**
 * Created by mohist on 8/23/15.
 */
var mongoose = require("mongoose");
var schema = new mongoose.Schema({
  //_id : {type: mongoose.Types.ObjectId, index : true},
  name : {type : String, unique : true},
  category : {type: mongoose.Schema.Types.ObjectId, ref : "Category"},
  subcategory : {type: mongoose.Schema.Types.ObjectId, ref : "SubCategory"},
  images : [Buffer],
  description : String,
  batch_ratio : Number, // ratio = normal_price / non_batch_price
  batch_threshold : Number, // if quantify below threshold, the price will be multiplied with batch_ratio
  delivery_time : Number, // in days
  download_link : String,
  available_sizes_image : Buffer,
  models : [
    {
      volume : Number,
      fabrics : {type : mongoose.Schema.Types.ObjectId, ref : "Fabric"},
      material : {type : mongoose.Schema.Types.ObjectId, ref : "Material"},
      price : Number
    }
  ]
}, {
  autoIndex : false
});
var model = mongoose.model("Category", schema);