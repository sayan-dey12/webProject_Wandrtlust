const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const expressError=require("./utils/expressError.js");
const bodyParser = require('body-parser');
const session=require("express-session");
const flash=require("connect-flash");   
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");



main()
.then(()=>{
    console.log("connection successful...");
})
.catch(err=>console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(bodyParser.urlencoded({ extended: true })); // Use extended: true for nested objects
app.use(bodyParser.json());


const sessionConfig={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}

app.get("/",(req,res)=>{
    res.send("hi..you are on root!!!..");
})

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"demouser@gmail.com",
//         username:"demouser"
//     })
//     let  registereduUser= await User.register(fakeuser,"hellothere");
//     res.send(registereduUser);
// })

//routes
const reviewsRouter=require("./routes/review.js")
const listingsRouter=require("./routes/listing.js");
const usersRouter=require("./routes/user.js");

//all listing routes//
app.use("/listing",listingsRouter);

//all review routes//
app.use("/listing/:id/reviews",reviewsRouter); 

//all user routes//
app.use("/",usersRouter);

app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page Not Found!"))
});

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong!"}=err;
    res.status(statusCode).render("listings/error.ejs",{err});
});

app.listen(8080,()=>{
    console.log("server is listening on port 8080...");
})