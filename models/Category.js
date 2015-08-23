/**
 * Created by mohist on 8/23/15.
 */
var mongoose = require("mongoose");
var schema = new mongoose.Schema({
  //_id : {type: mongoose.Types.ObjectId, index : true},
  name : {type : String, unique : true},
  subcategories : [{type: mongoose.Schema.Types.ObjectId, ref : "SubCategory", unique : true}]
}, {
  autoIndex : false
});
var model = mongoose.model("Category", schema);

//function generateCategory() {
//  var subCategories = [
//    {name: "Sofas", codeName : "sofa"},
//    {name: "Chairs", codeName : "chair"},
//    {name: "Bedheads", codeName : "bedhead"},
//    {name: "Coffee Tables & Side Tables", codeName : "coffee_side_table"},
//    {name: "Consoles", codeName : "console"},
//    {name: "Dining Tables", codeName : "dining_table"},
//    {name: "Cabinets & Shelves", codeName : "cabinet_shelf"},
//    {name: "Others", codeName : "others"}
//  ];
//  SubCategory.create(subCategories, function(err, subs) {
//    if (!err) {
//      var categoryIds = [];
//      for (var i = 0; i < subs.length; i++) {
//        categoryIds.push(subs[i]._id);
//      }
//      Category.create({
//        name : "Furniture",
//        codeName : "furniture",
//        subcategories : categoryIds
//      }, function(err, category) {
//        if (!err) {
//          console.log("saved")
//        }
//      });
//    }
//  });
//}

module.exports = model;
