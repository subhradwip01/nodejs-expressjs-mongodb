const express=require("express");
const { body } = require('express-validator/check');
const User=require("../models/user")
const router=express.Router();
const autController=require("../controllers/auth")

router.put("/signup",[
    body("email")
    .isEmail()
    .withMessage("Please enter a valid emial")
    .custom((value,{req})=>{
        return User.findOne({email:value}).then(userDoc=>{
            if(userDoc){

                return Promise.reject("Email already Exists");

            }
        })
    })
    .normalizeEmail(),
    body("password")
    .trim()
    .isLength({min:5}),
    body("name")
    .trim()
    .isLength({min:5})

],autController.putSignUp);

router.post("/login",autController.postLogin)

module.exports=router;