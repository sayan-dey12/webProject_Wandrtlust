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
    let mapKey="QSJdDRscc73p4UIb3elk6AoiG2lq8Z21";
    const listingId=await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listingId){
        req.flash("error","Listing you requested is not found");
        res.redirect("/listing");
    }if(listingId.coordinates.longitude==0 && listingId.coordinates.latitude==0){
        const address=encodeURIComponent(listingId.location);
        
       const response =await fetch(`https://api.tomtom.com/search/2/geocode/${address}.json?key=${mapKey}`)
       if(!response.ok){
           req.flash("error","Location not found");
           return res.redirect("/listing/new");
        }
        const data=await response.json();
        const result=data.results[0];
        listingId.coordinates.latitude=result.position.lat;
        listingId.coordinates.longitude=result.position.lon;
    
    }
    res.render("listings/show.ejs",{listingId});
}

module.exports.createListing=async(req,res,next)=>{  
    let mapKey="QSJdDRscc73p4UIb3elk6AoiG2lq8Z21";
    const address=encodeURIComponent(req.body.listing.location);
    console.log(address); 
    
   const response =await fetch(`https://api.tomtom.com/search/2/geocode/${address}.json?key=${mapKey}`)
   if(!response.ok){
       req.flash("error","Location not found");
       return res.redirect("/listing/new");
    }
    const data=await response.json();
    const result=data.results[0]

    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={filename,url};
    newListing.coordinates.latitude=result.position.lat;
    newListing.coordinates.longitude=result.position.lon;
    await newListing.save();
    
    req.flash("success","Successfully created a new listing");
    res.redirect("/listing");
}

module.exports.updateListing=async(req,res)=>{
    let{id}=req.params;
    let listings=await listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listings.image={filename,url};
        await listings.save();
    }
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
    let originalUrl=listingId.image.url;
    originalUrl=originalUrl.replace("/upload","/upload/w_250,");
    res.render("listings/edit.ejs",{listingId,originalUrl});
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Successfully deleted");
    res.redirect("/listing");
}