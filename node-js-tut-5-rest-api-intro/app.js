const express=require("express");
const bodyParser=require("body-parser");
const feedRouts=require("./router/feed");
const res = require("express/lib/response");
const app=express();


//======== middleware ==========

//------Body Parser-------------
app.use(bodyParser.json()); //application/json

// ---------setting up header for CORS---------
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers","Content-Type,Authorization");
    next();
})

// -----Routes--------
app.use(feedRouts);

app.listen(8080)