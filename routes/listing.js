const express=require('express');
const router=express.Router();
const listing=require("../models/listing");
const wrapeAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js"); 
const ListingController=require("../controllers/listing.js");



//index route
router.get("/",wrapeAsync(ListingController.index));

//new route
router.get("/new",isLoggedIn,ListingController.renderNewForm);

//show route
router.get("/:id",wrapeAsync(ListingController.showListing));

//crearte route
router.post("/",validateListing,isLoggedIn,wrapeAsync(ListingController.createListing));

//update route
router.put("/:id",validateListing,isLoggedIn,isOwner,wrapeAsync(ListingController.updateListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapeAsync());

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapeAsync(ListingController.destroyListing));


module.exports=router;