import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/userModel.js";

// Middleware for HTTP requests
export const verifyJWT = async (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      throw new ApiError(401, "Unauthorized request: No token provided");
    }

    // Verify token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new ApiError(401, "Access token expired");
      }
      throw new ApiError(401, "Invalid access token");
    }

    // Find user by ID in decoded token
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(401, "Invalid access token: User not found");
    }

    // Attach user to the request
    req.user = user;
    next(); // Proceed to the next middleware
  } catch (error) {
    next(error); // Pass errors to the centralized error handler
  }
};

// Middleware for WebSocket connections
export const verifyWSToken = (socket, next) => {
  try {
    // Extract token from headers
    const token = socket.handshake.headers['authorization']?.split(' ')[1]; // Get the token from the Authorization header

    if (!token) {
      return next(new ApiError(401, "Unauthorized request: No token provided")); // Handle missing token
    }

    // Verify token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(new ApiError(401, "Access token expired")); // Handle token expiration
      }
      return next(new ApiError(401, "Invalid access token")); // Handle invalid token
    }

    // Find user by ID in decoded token
    User.findById(decodedToken?._id).select("-password -refreshToken").then((user) => {
      if (!user) {
        return next(new ApiError(401, "Invalid access token: User not found")); // Handle user not found
      }

      socket.userId = user._id; // Attach user ID to socket object
      next(); // Proceed with the connection
    }).catch((err) => {
      return next(new ApiError(500, "Internal Server Error")); // Handle potential errors
    });

  } catch (error) {
    next(error); // Pass errors to the centralized error handler
  }
};
