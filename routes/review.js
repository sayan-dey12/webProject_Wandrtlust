const express=require("express");
const router=express.Router({mergeParams:true});    
const listing=require("../models/listing");
const wrapeAsync=require("../utils/wrapAsync.js");
const Review=require("../models/reviews.js");
const {validateReview, isLoggedIn,isReviewOwner}=require("../middleware.js");
const ReviewController=require("../controllers/review.js");

//review
//post review route
router.post("/",validateReview,isLoggedIn, wrapeAsync(ReviewController.postReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewOwner,wrapeAsync(ReviewController.destroyReview));


module.exports=router;  