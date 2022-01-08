const express = require("express");

const { check, body } = require("express-validator/check");

const router = express.Router();

const authController = require("../controllers/auth");
const User=require("../models/user")

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email")
    .isEmail()
    .withMessage("Please Eater a valid email")
    .custom((value,{req})=>{
        // async validation
        return User.findOne({ email: value })
        .then((userdoc) => {
          if (userdoc) {
            return Promise.reject("User Already exist");
          }
        })
    })
    .normalizeEmail(),

    body("password", "Password shoud be 5 charecters")
    .trim()
      .isLength({ min: 5 })
      .isAlphanumeric()
       ,       
      body("cpassword")
      .trim()
      .custom((value,{req})=>{
          if(value!==req.body.password){
            throw new Error("Password should match")
          }
          return true;
         
      })
  ],
  authController.postSignup
);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
