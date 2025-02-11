const User=require("../models/user.js");


module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err) return next(err);
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listing");
        })
        
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup");
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.controllerLogin=async(req,res)=>{
    req.flash("success","Welcome back!");
    const redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
}

module.exports.controllerLogout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Goodbye!");
        res.redirect("/listing");
    });
   
}