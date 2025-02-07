const express=require("express");
const wrapAsync = require("../utils/wrapAsync");
const router=express.Router();   
const User=require("../models/user.js");
const passport=require("passport");

router.get("/signup",(req,res)=>{
    res.render("users/signup");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listing");
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})
router.post("/login",passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome back!");
    res.redirect("/listing");
})

module.exports=router;