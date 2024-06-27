const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware');
const userController = require("../controllers/user");

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
});

router.post("/signup",wrapAsync(userController.signup));

router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
});

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true,
    }),
    userController.login
)

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
})

module.exports = router;