const express=require("express");
const app=express();
const mongoose=require("mongoose");
const listing=require("./models/listing");
const path=require("path");
const methodOverride=require("method-override");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

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

//index route
app.get("/listing",async(req,res)=>{
    const allListings=await listing.find({});
    res.render("listings/index.ejs",{allListings});
})

//new route
app.get("/listing/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//show route
app.get("/listing/:id",async(req,res)=>{
    let{id}=req.params;
    const listingId=await listing.findById(id);
    res.render("listings/show.ejs",{listingId});
})

//crearte route
app.post("/listing",async(req,res)=>{
    const newListing=new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
})

//update route
app.put("/listing/:id",async(req,res)=>{
    let{id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`)
})

//edit route
app.get("/listing/:id/edit",async(req,res)=>{
    let{id}=req.params;
    const listingId=await listing.findById(id);
    res.render("listings/edit.ejs",{listingId});
})

//delete route
app.delete("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listing");
})

// app.get("/testListing",async(req,res)=>{
//     const sampleListing=new listing({
//         title:"My new villa",
//         descpription:"by the mountains",
//         price:1200,
//         location:"shevok",
//         country:"India"
//     })
//     await sampleListing.save();
//     console.log("test successful...");
//     res.send("sample was saved...");
    
// })

app.listen(8080,()=>{
    console.log("server is listening on port 8080...");
})