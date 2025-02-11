const express=require('express');
const router=express.Router();
const listing=require("../models/listing");
const wrapeAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js"); 
const ListingController=require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })

router.route("/")
.get(wrapeAsync(ListingController.index))
.post(isLoggedIn,upload.single("listing[image][url]"),validateListing,wrapeAsync(ListingController.createListing));



//new route
router.get("/new",isLoggedIn,ListingController.renderNewForm);

router.route("/:id")
.get(wrapeAsync(ListingController.showListing))
.get(isLoggedIn,isOwner,wrapeAsync(ListingController.renderEditForm))
.put(validateListing,isLoggedIn,isOwner,wrapeAsync(ListingController.updateListing))
.delete(isLoggedIn,isOwner,wrapeAsync(ListingController.destroyListing))



module.exports=router;