const mongoose = require("mongoose");
const {Schema} = require("mongoose");

let postItemsSchema = new Schema({
category:{
type:String
},
categoryType: {
  type: String
},
user_id:{
  type:String
},
description:{
  type:String
},
price:{
  type:String
},
title:{
  type:String
},
contact: {
  type: String,

},
image:{
  type:Array
},
image_id:{
  type:String
},
data:{
  type:Object
},
image_url:{
  type:String
},
categoryTitle:{
  type:String
}
});

module.exports = mongoose.model("postItems", postItemsSchema);
