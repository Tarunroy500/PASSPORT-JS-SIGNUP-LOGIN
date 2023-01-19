const mongoose = require('mongoose')
const plm=require("passport-local-mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/registerlogin");
const userSchema = new mongoose.Schema({
  username: {
    type:String,
    required:true,
  },
  email:String,
  number:Number,
  image:String,
  
})
userSchema.plugin(plm)
module.exports = mongoose.model("registeruser",userSchema);

