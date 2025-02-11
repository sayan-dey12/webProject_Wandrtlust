const express=require("express");
const wrapAsync = require("../utils/wrapAsync");
const router=express.Router();   
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup))

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true}),userController.controllerLogin)

router.get("/logout",userController.controllerLogout)

module.exports=router;