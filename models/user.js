// const mongoose = require("mongoose");


// const userschema = new mongoose.Schema({
//     username:String,
//     email:String,
//     password:String
// })

// const userModel = mongoose.model('user',userschema);

// module.exports = userModel;


import mongoose  from "mongoose";
import bcrypt from "bcrypt";

const userschema = new mongoose.Schema({
     username : {type: String,required:true,unique:true},
     leetcodeName : {type: String,required:true,unique:true},
     password : {type: String,required:true,unique:true}
});

userschema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});

const userModel = mongoose.model('user',userschema);

export default userModel;