const listing=require("../models/listing");
const Review=require("../models/reviews.js");


module.exports.postReview=async(req,res)=>{
    let Listing=await listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    Listing.reviews.push(newReview);
    
    await newReview.save();
    await Listing.save();

    req.flash("success","Successfully review added");

   // console.log("review saved successfully");
    res.redirect(`/listing/${Listing._id}`);
}

module.exports.destroyReview=async(req,res)=>{
    let{id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Successfully review deleted");
    res.redirect(`/listing/${id}`);
}