import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name!"],
    minlength: [3, "Minimum length should be at least 3 characters"],
    maxlength: [30, "Maximum length should be at most 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: [true, "User already registered"],
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: {
    type: String,
    required: [true, "Please provide your phone number!"],
    unique: [true, "User already registered"],
    validate: [
      validator.isMobilePhone,
      "Please provide a valid phone number",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide your password!"],
    minlength: [6, "Minimum length should be at least 6 characters"],
    maxlength: [30, "Maximum length should be at most 30 characters"],
    select:false  // whenever we will get the user it will not get the password
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  createdAt:{
    type:Date,
    default:Date.now
  }
});


//===> Hashing the password using the bcrypt library =========

userSchema.pre('save',async function(){
  if(!this.isModified("password")){
    next();
  }
  this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.comparePassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password);
}

//===> Generating JWT token for the user =========
  userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  };

const User = mongoose.model("User", userSchema);

export default User;
