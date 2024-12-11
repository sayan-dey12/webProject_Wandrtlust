const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listinigSchema=new Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type: String,
        require:true
    },
    image:{
        filename:{
            type:String,
            require:true
        },
        url:{
            type:String,
            default:"https://plus.unsplash.com/premium_photo-1663013616638-ad7fbc96878b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v)=>
                v===""
                ?"https://plus.unsplash.com/premium_photo-1663013616638-ad7fbc96878b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                :v,
        }
    },
    price:{
        type:Number
    },
    location:{
        type:String,
        require:true
    },
    country:{
        type:String,
        require:true
    }
});

const Listing=mongoose.model("Listing",listinigSchema);
module.exports=Listing;