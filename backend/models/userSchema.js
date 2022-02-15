const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    logo:{
        type:String
    },
    resetPasswordToken:{
        type:Number
    },
    resetPasswordExpires:{
        type:Date
    },
    isVerified:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("userData",userSchema)