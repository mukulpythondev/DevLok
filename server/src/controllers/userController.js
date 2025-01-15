import { hash,compare } from "bcrypt";
import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; // Ensure this is defined correctly
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendmail.js";

export const generateAcesstokenAndRefreshtoken=async (userId)=>{
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
  const { name, email, password, profile, publicId, publicKey,bio , linkedinUrl} = req.body;
  const { n, e } = publicKey;
  try {
    if (!name?.trim() || !email?.trim() || !password?.trim() || !profile?.trim() || !publicId?.trim() || !bio.trim()) {
      throw new ApiError(400, "All fields are required.");
    }

    if (!publicKey) {
      throw new ApiError(400, "Public key is required.");
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      throw new ApiError(400, "User already exists.");
    }

    const hashedPassword = await hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profile,
      publicId,
      publicKey: {n,e},
      otp,
      otpExpiry,
      bio,
      linkedinUrl
    });

    const createdUser = await User.findById(user._id).select("-password -otp -otpExpiry");
    await sendMail(user.email, otp);

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfully. Please verify your OTP."));
  } catch (error) {
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
      maxAge: 24 * 60 * 60 * 1000,
      sameSite:"None" // 1 day
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
          sameSite: "None",
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
// export const getUserPublicKey = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select("publicKey");
//     if (!user) {
//       return res.status(404).json(new ApiResponse(404, {}, "User not found"));
//     }
//     res.status(200).json(new ApiResponse(200, { publicKey: user.publicKey }, "Public key feteched successfully."));
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch public key" });
//   }
// };
// export const updateUserPublicKey = async (req, res) => {
//   try {
//     const { publicKey } = req.body;

//     if (!publicKey) {
//       return res.status(400).json(new ApiResponse(400, {}, "Public key is required."));
//     }

//     const user = await User.findByIdAndUpdate(req.user._id, { publicKey }, { new: true });
//     if (!user) {
//       return res.status(404).json(new ApiResponse(404, {}, "User not found"));
//     }
//     res.status(200).json(new ApiResponse(200, {}, "Public key updated successfully."));
//   } catch (error) {
//     res.status(500).json(new ApiResponse(500, {}, "Failed to update the public key."));
//   }
// };


const updateProfile = async (req, res) => {
  const { name, bio, linkedinUrl, profile, publicId } = req.body;
  const userId = req.user._id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    // Update the user's profile information
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name ?? user.name, // Update name if provided
        bio: bio ?? user.bio, // Update bio if provided
        linkedinUrl: linkedinUrl ?? user.linkedinUrl, // Update linkedinUrl if provided
        profile: profile ?? user.profile, // Update profile image URL if provided
        publicId: publicId ?? user.publicId, // Update profile image public ID if provided
      },
      { new: true }
    ).select("-password -otp -otpExpiry"); // Exclude sensitive data from the response

    return res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully."));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Something went wrong while updating the profile.",
    });
  }
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email || !email.length) {
      throw new ApiError(400, "Email is required.");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    // Check if the account is Google-based
    if (!user.password) {
      throw new ApiError(
        400,
        "This account was created using Google. Password reset is not allowed for Google accounts."
      );
    }

    // Generate OTP and set expiry
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 300000; // OTP valid for 5 minutes
    await user.save();

    // Send the OTP via email
    await sendMail(user.email, otp);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "OTP has been sent to your email."));
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong in forgot password.",
    });
  }
};
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      throw new ApiError(400, "Email, OTP, and new password are required.");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    // Reuse `verifyOTP` logic to validate the OTP
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      throw new ApiError(400, "Invalid or expired OTP.");
    }

    // Hash the new password and save it
    user.password = await hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password reset successful."));
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong in resetting the password.",
    });
  }
};


export { SignUp,updateProfile, Login,Logout,RefreshAccessToken,getUserDetails, verifyOTP , getAllUserDetails , updateUserAction,getFavourites};