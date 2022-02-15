const express = require('express'); //imported express
const mongoose = require('mongoose'); //imported mongoose
const cors = require('cors'); //imported cors

const { connectDB } = require('./configFiles/dbConnect');

const PORT=process.env.PORT || 8888; //define port
const app=express(); //assigned express to app

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static("profile_pic"));  //for img

app.use(cors());
connectDB()

//load routes
const cvBuilder_Routes=require('./routes/cvBuilder_Routes');

app.use("/",cvBuilder_Routes);

app.listen(PORT,(err)=>{
    if(err) throw err;
    console.log(`Work on ${PORT}`);
})