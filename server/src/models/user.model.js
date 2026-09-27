const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");  

const userSchema = new mongoose.Schema({
    fullName:{
      type:String,
      required:true,
    },
    email:{
      type:String,
      required:true,
    },
    password:{
      type:String,
      required:true,
    },
    phoneNumber:{
      type:String,
      required:true,
    },
    role:{
      type:String,
      enum:["User","restaurantOwner","admin"],
      default:"User",
    },
    refreshToken:{
      type:String,
    }
}, {
    timestamps: true
});

userSchema.pre("save",async function(){
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken =  function(){
    return jwt.sign(
    {
      _id:this.id,
      email:this.email,
    },
     process.env.JWT_ACCESS_SECRET,
     {
      expiresIn: "15m"
     }
   )
}
userSchema.methods.generateRefreshToken =  function(){
  return jwt.sign(
    {
      _id:this.id,
    },
     process.env.JWT_REFRESH_SECRET,
     {
      expiresIn: "7d"
     }
   )
}

const User = mongoose.model("User", userSchema);

module.exports = User;