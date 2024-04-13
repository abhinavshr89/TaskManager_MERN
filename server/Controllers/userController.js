import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import User from "../models/userSchema.js";
import cloudinary from "cloudinary"
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("User Avatar Required!", 400));
  }

  const { avatar } = req.files;
  const allowedFormats = [
    "image/png",
    "image/jpeg",
    "image/avif",
    "image/webp",
    "image/jpg"
  ];

  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("Invalid Avatar Format!", 400));
  }


  const {name,email,phone,password}=req.body;
  if(!email ||!name || !phone || !password) {
    return next(new ErrorHandler("Please fill all the fields!", 400));
  }

  let user = await User.findOne({email});
  if(user) {
    return next(new ErrorHandler("User already registered!", 400));
  }
  
  const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath)
  
  if(!cloudinaryResponse || cloudinary.error){
    console.error("Cloudinary Error", cloudinaryResponse.error || "Unknown Cloudinary Error");
  }

  const newUser = new User({
    name,
    email,
    phone,
    password,
    avatar:{
        public_id:cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url
    }

});

await newUser.save(); // Save the new user to the database
sendToken("User registered ",newUser,res,200);


});
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password!", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password!", 400));
  }
  sendToken("User Logged In ",user,res,200);
 
});

export const logout = catchAsyncErrors((req, res, next) => {
  // Set HTTP status code to 200 indicating a successful response
  res.status(200)
    // Set a cookie named "token" with an empty value
    .cookie("token", "", {
      // Set expiration date in the past to remove the token from the client's browser
      expires: new Date(Date.now()),
      // Set httpOnly to true to prevent client-side JavaScript from accessing the cookie
      httpOnly: true,
    })
    // Send a JSON response indicating success with a message stating that the user has been logged out
    .json({
      success: true,
      message: "User Logged Out Successfully!",
    });
});

export const myProfile = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
