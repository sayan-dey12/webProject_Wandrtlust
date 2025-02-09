const express=require("express");
const router=express.Router({mergeParams:true});    
const listing=require("../models/listing");
const wrapeAsync=require("../utils/wrapAsync.js");
const Review=require("../models/reviews.js");
const {validateReview, isLoggedIn,isReviewOwner}=require("../middleware.js");


//review
//post review route
router.post("/",validateReview,isLoggedIn, wrapeAsync(async(req,res)=>{
    let Listing=await listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    Listing.reviews.push(newReview);
    
    await newReview.save();
    await Listing.save();

    req.flash("success","Successfully review added");

   // console.log("review saved successfully");
    res.redirect(`/listing/${Listing._id}`);
}))

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewOwner,wrapeAsync(async(req,res)=>{
    let{id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Successfully review deleted");
    res.redirect(`/listing/${id}`);
}));


module.exports=router;  