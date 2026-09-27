const mongoose= require("mongoose");
const ownereRequestSchema = new mongoose.Schema({


  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },

  status:{
    type:String,
    enum:["PENDING","APPROVED","REJECTED"],
    default:"PENDING"
  },
  
  reason:{
    type:String,
    trim:true,
  }
},{
  timestamps:true
});


const OwnerRequest = mongoose.model("OwnerRequest",ownereRequestSchema);


module.exports = OwnerRequest;