const express=require("express");
const app=express();
const mongoose=require("mongoose");
const listing=require("./models/listing");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapeAsync=require("./utils/wrapAsync.js");
const expressError=require("./utils/expressError.js");
const {listingSchema}=require("./schema.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


main()
.then(()=>{
    console.log("connection successful...");
})
.catch(err=>console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.get("/",(req,res)=>{
    res.send("hi..you are on root!!!..");
})

const validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
};

//index route
app.get("/listing",wrapeAsync(async(req,res)=>{
    const allListings=await listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//new route
app.get("/listing/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//show route
app.get("/listing/:id",wrapeAsync(async(req,res)=>{
    let{id}=req.params;
    const listingId=await listing.findById(id);
    res.render("listings/show.ejs",{listingId});
}));

//crearte route
app.post("/listing",validateListing,wrapeAsync(async(req,res,next)=>{
    const newListing=new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
}));

//update route
app.put("/listing/:id",validateListing,wrapeAsync(async(req,res)=>{
    let{id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`)
}));

//edit route
app.get("/listing/:id/edit",wrapeAsync(async(req,res)=>{
    let{id}=req.params;
    const listingId=await listing.findById(id);
    res.render("listings/edit.ejs",{listingId});
}));

//delete route
app.delete("/listing/:id",wrapeAsync(async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page Not Found!"))
});

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong!"}=err;
    res.status(statusCode).render("listings/error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("server is listening on port 8080...");
})