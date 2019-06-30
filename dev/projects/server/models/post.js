const mongoose = require("mongoose");
const {Schema} = require("mongoose");

let postSchema = new Schema({

    firstName: {
      type: String,

    },
    email: {
      type: String,

    },
    password: {
      type: String,

    },
    surName: {
      type: String,

    },
    city: {
      type: String,
    },
    id:{
      type: String
    },
    comfirm:{
      type:Boolean,
      default:false
    },
    status:{
      type:String,
      default:'Member'
    }

});

module.exports = mongoose.model("post", postSchema);
