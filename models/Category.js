/**
 * Created by mohist on 8/23/15.
 */
var mongoose = require("mongoose");
var schema = new mongoose.Schema(
  {
    //_id : {type: mongoose.Types.ObjectId, index : true},
    name: { type: String, unique: true },
    subcategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", unique: true }
    ],
    deleted: { type: Boolean }
  },
  {
    autoIndex: false
  }
);
var model = mongoose.model("Category", schema);

function deleteCategory(catName) {
  Category.find().exec(function(err, categories) {
    if (!err) {
      const category = categories.find(cat => cat.name === catName);
      if (!category) {
        console.log("no category found");
        return;
      }
      category.deleted = true;
      category.save((error, category) => {
        if (!error) {
          console.log("category deleted successfully");
        } else {
          console.log("delete product failed", error);
        }
      });
    } else {
      console.log("error");
    }
  });
}

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
