var mongoose = require("mongoose");
var schema = new mongoose.Schema({
    //_id : {type: mongoose.Types.ObjectId, index : true},
    name : String,
    price_group : String,
    type : String,
    image : {
        path : String,
        content_type : String
    }
}, {
    autoIndex : false
});
var model = mongoose.model("Fabrics", schema);
module.exports = model;