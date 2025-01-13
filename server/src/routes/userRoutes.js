import { Router } from "express";
import {
  forgotPassword,
  getAllUserDetails,
  getFavourites,
  getUserDetails,
  Login,
  Logout,
  RefreshAccessToken,
  resetPassword,
  SignUp,
  updateProfile,
  updateUserAction,
  verifyOTP,
} from "../controllers/userController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { getMessage, sendMessage } from "../controllers/messageController.js";

const router = Router();

router.post("/signup", SignUp);
router.post("/verify-otp", verifyOTP);
router.post("/login", Login);
router.post("/logout", verifyJWT, Logout);
router.get("/user/details", verifyJWT, getUserDetails);
router.get("/getallusers", verifyJWT, getAllUserDetails);
router.get("/getfavourite", verifyJWT, getFavourites);
router.patch("/addtofavourite/:id", verifyJWT, updateUserAction);
router.patch("/addtodisliked/:id", verifyJWT, updateUserAction);
router.post("/refresh-token", RefreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/message/send/:id", verifyJWT, sendMessage);
router.get("/message/get/:id", verifyJWT, getMessage);
router.put("/profile",verifyJWT, updateProfile);
export default router;
