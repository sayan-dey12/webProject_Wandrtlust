const express=require("express");
const router=express.Router({mergeParams:true});    
const listing=require("../models/listing");
const wrapeAsync=require("../utils/wrapAsync.js");
const expressError=require("../utils/expressError.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/reviews.js");


const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
};



//review
//post review route
router.post("/",validateReview, wrapeAsync(async(req,res)=>{
    let Listing=await listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    Listing.reviews.push(newReview);
    
    await newReview.save();
    await Listing.save();

    req.flash("success","Successfully review added");

   // console.log("review saved successfully");
    res.redirect(`/listing/${Listing._id}`);
}))

//delete review route
router.delete("/:reviewId",wrapeAsync(async(req,res)=>{
    let{id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Successfully review deleted");
    res.redirect(`/listing/${id}`);
}));


module.exports=router;  