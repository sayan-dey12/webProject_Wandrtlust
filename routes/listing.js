const express=require('express');
const router=express.Router();
const listing=require("../models/listing");
const wrapeAsync=require("../utils/wrapAsync.js");
const expressError=require("../utils/expressError.js");
const {listingSchema}=require("../schema.js");
const {isLoggedIn}=require("../middleware.js"); 


const validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        console.log(req.body)
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
};

//index route
router.get("/",wrapeAsync(async(req,res)=>{
    const allListings=await listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//new route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
})

//show route
router.get("/:id",wrapeAsync(async(req,res)=>{
    let{id}=req.params;
    const listingId=await listing.findById(id).populate("reviews").populate("owner");
    if(!listingId){
        req.flash("error","Listing you requested is not found");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs",{listingId});
}));

//crearte route
router.post("/",validateListing,isLoggedIn,wrapeAsync(async(req,res,next)=>{
    const newListing=new listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","Successfully created a new listing");
    res.redirect("/listing");
}));

//update route
router.put("/:id",validateListing,isLoggedIn,wrapeAsync(async(req,res)=>{
    let{id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Successfully updated");
    res.redirect(`/listing/${id}`)
}));

//edit route
router.get("/:id/edit",isLoggedIn,wrapeAsync(async(req,res)=>{
    let{id}=req.params;
    const listingId=await listing.findById(id);
    if(!listingId){
        req.flash("error","Listing you requested is not found");
        res.redirect("/listing");
    }
    res.render("listings/edit.ejs",{listingId});
}));

//delete route
router.delete("/:id",isLoggedIn,wrapeAsync(async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Successfully deleted");
    res.redirect("/listing");
}));


module.exports=router;