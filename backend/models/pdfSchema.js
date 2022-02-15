const mongoose = require("mongoose")

const pdfSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    pdfData:Array
},{timestamps:true}
)

module.exports = mongoose.model("pdfData",pdfSchema)