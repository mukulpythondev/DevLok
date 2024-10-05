import { hash,compare } from "bcrypt";
import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; // Ensure this is defined correctly
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendmail.js";

const generateAcesstokenAndRefreshtoken=async (userId)=>{
 try {
   const user = await User.findById(userId)
   const accessToken = jwt.sign(
     { _id: user._id, email: user.email },
     process.env.ACCESS_TOKEN_SECRET,
     { expiresIn: '1h' }
 );
 
 const refreshToken = jwt.sign(
     { _id:user._id },
     process.env.REFRESH_TOKEN_SECRET, // Corrected secret
     { expiresIn: '10d' }
 );
 
 // Save refresh token in the user document
 user.refreshToken = refreshToken;
 await user.save({ validateBeforeSave: false });
 return {accessToken,refreshToken}
 } catch (error) {
  throw new ApiError(500,"Server Error: Something went wrong when creating the access token and refresh token")
 }
}
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};
const SignUp = async (req, res) => {
  const { name, email, password, profile, publicId } = req.body;
  try {
    // Check for required fields
    if (!name?.trim().length || !email?.trim().length || !password?.trim().length || !profile?.trim().length || !publicId?.trim().length) {
      throw new ApiError(400, "All Fields are required.");
    }

    // Check if user already exists
    const existedUser = await User.findOne({email});
    if (existedUser) {
      throw new ApiError(400, "User Already Exists.");
    }

    // Hash the password
    const hashedPassword = await hash(password, 10); 
    // otp logic 
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000;
    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profile,
      publicId,
      otp,
      otpExpiry,
    });
    // Find the created user without password
    // const createdUser = await User.findById(user._id).select("-password");
    // if (!createdUser) {
    //   throw new ApiError(500, "User could not be created.");
    // }
   
    const createdUser = await User.findById(user._id).select("-password -otp -otpExpiry");
    if (!createdUser) {
      throw new ApiError(500, "User could not be created.");
    }
    await sendMail(user.email, otp)
    // Send success response
    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfully. Please verify your OTP."));
  } catch (error) {
    // Handle errors
    res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Something went wrong while creating the user.",
    });
  }
};
// OTP verification and token generation
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({email});

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    // Check if OTP is correct and not expired
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      throw new ApiError(400, "Invalid or expired OTP.");
    }

    // Clear the OTP fields after verification
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate tokens and store them in cookies
    const { accessToken, refreshToken } = await generateAcesstokenAndRefreshtoken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    // Store tokens in cookies and return success response
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken }, "OTP verified, user logged in."));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Something went wrong during OTP verification.",
    });
  }
};
const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
      if (!email.length || !password.length) {
          throw new ApiError(400, "All fields are required.");
      }

      const loginUser = await User.findOne({ email });
      if (!loginUser) {
          throw new ApiError(404, "User does not exist.");
      }

      const isPasswordCorrect = await compare(password, loginUser.password); // Correct comparison
      if (!isPasswordCorrect) {
          throw new ApiError(400, "Invalid Credentials.");
      }

      
      const {refreshToken,accessToken}= await generateAcesstokenAndRefreshtoken(loginUser._id)

      const options = {
          httpOnly: true,
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
          // maxAge: 7 * 24 * 60 * 60 * 1000,
      };

      return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(new ApiResponse(200, { user: loginUser, accessToken, refreshToken }, "User logged in successfully."));
  } catch (error) {
    console.error("Login error:", error); // Log the error for debugging
    return res.status( error.statusCode || 500).json({
      message: error.message || "Something went wrong in login.",
    });
  }
};
const Logout= async (req,res)=>{
  await User.findByIdAndUpdate(req.user._id, {
    $unset:{
      refreshToken:1  // better than undefined
    }
  },
{
  new:true
} )
const options= {
  httpOnly:true,
  secure: true,
 }
 return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).
 json( new ApiResponse(200, {}, "User Logged Out.") )
}
 const RefreshAccessToken= async( req,res)=> {
  const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken
  if(!incomingRefreshToken)
  {
    throw new ApiError(401, "Unauthorized Request")
  }
 try {
   const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
   const user  = await User.findById(decodedToken?._id)
   if(!user) 
   {
     throw new ApiError(401, "Invalid Refresh Token")
   }
   if(user?.refreshToken !== incomingRefreshToken)
   { 
     throw new ApiError(401, "Refresh token is expired or used")
   }
   const options= {
     httpOnly:true,
     secure: true,
     maxAge: 24 * 60 * 60 * 1000,
    }
    const  {accessToken,newRefreshToken} = await generateAcesstokenAndRefreshtoken(user._id)
    return res.status(200).cookie( "accessToken",accessToken,options).cookie("refreshToken",newRefreshToken,options).json(
     new ApiResponse(200, {accessToken, refreshToken:newRefreshToken}, "Access token refreshed successfully")
    )
 } catch (error) {
  throw new ApiError(401, error?.meessage || "Invalid Refresh Token")
 }
 }
 const getUserDetails = async (req, res) => {
  try {
   
    return res.status(200).json(new ApiResponse(200, req?.user, "User details retrieved successfully."));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Something went wrong while fetching user details.",
    });
  }
};
const getAllUserDetails= async (req,res) =>{
  try {
    const allUsers= await  User.find().select("-password -refreshToken")
    return res.status(200).json(new ApiResponse(200, allUsers, "All users fetched successfully"))
    
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Something went wrong during fetching all users.",
    });
  }
}
const updateUserAction = async (req, res) => {
  try {
    const { id } = req.params; // User ID to add to favourites/dislikes
    const { actionType } = req.body; // Action type can be 'favourite' or 'dislike'
    const userId = req.user._id; 

    // Find the current user
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Handle action based on actionType
    if (actionType === "favourite") {
      // Check if user is already in favourites
      if (!user.favourites.includes(id)) {
        user.favourites.push(id);
        await user.save();
        return res.status(200).json(new ApiResponse(200, user, "User added to favourites"));
      } else {
        return res.status(400).json(new ApiResponse(400, {}, "User already added to favourites."));
      }
    } else if (actionType === "dislike") {
      // Check if user is already in dislikes
      if (!user.disliked.includes(id)) {
        user.disliked.push(id);
        await user.save();
        return res.status(200).json(new ApiResponse(200, user, "User added to dislikes"));
      } else {
        return res.status(400).json(new ApiResponse(400, {}, "User already added to dislikes."));
      }
    } else {
      return res.status(400).json(new ApiResponse(400, {}, "Invalid action type"));
    }
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, {}, "Internal server error while updating user action"));
  }
};
const getFavourites = async (req, res) => {
  try {
    const userId = req.user._id; // Get the logged-in user's ID

    // Find the user by ID and populate the favourites field to get user details
    const user = await User.findById(userId).populate('favourites', '-password -refreshToken'); // Exclude sensitive fields like password and refreshToken

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Return the list of favourites
    return res.status(200).json(new ApiResponse(200, user.favourites, "Favourites retrieved successfully."));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Something went wrong while fetching favourites.",
    });
  }
};

export { SignUp, Login,Logout,RefreshAccessToken,getUserDetails, verifyOTP , getAllUserDetails , updateUserAction,getFavourites};