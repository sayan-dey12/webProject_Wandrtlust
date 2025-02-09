const listing=require("../models/listing");


module.exports.index=async(req,res)=>{
    const allListings=await listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let{id}=req.params;
    const listingId=await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listingId){
        req.flash("error","Listing you requested is not found");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs",{listingId});
}

module.exports.createListing=async(req,res,next)=>{
    const newListing=new listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","Successfully created a new listing");
    res.redirect("/listing");
}

module.exports.updateListing=async(req,res)=>{
    let{id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Successfully updated");
    res.redirect(`/listing/${id}`)
}

module.exports.renderEditForm=async(req,res)=>{
    let{id}=req.params;
    const listingId=await listing.findById(id);
    if(!listingId){
        req.flash("error","Listing you requested is not found");
        res.redirect("/listing");
    }
    res.render("listings/edit.ejs",{listingId});
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Successfully deleted");
    res.redirect("/listing");
}