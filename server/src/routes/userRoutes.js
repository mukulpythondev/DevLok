import { Router } from "express";
import { getAllUserDetails, getUserDetails, Login, Logout, RefreshAccessToken, SignUp, updateUserAction, verifyOTP } from "../controllers/userController.js";
import {verifyJWT} from "../middleware/authMiddleware.js"
const router= Router();


router.post("/signup", SignUp )
router.post("/verify-otp", verifyOTP)
router.post('/login', Login)
router.post('/logout', verifyJWT, Logout)
router.get("/user/details", verifyJWT, getUserDetails); 
router.get("/getallusers", verifyJWT, getAllUserDetails); 
router.patch("/addtofavourite/:id", verifyJWT, updateUserAction); 
router.patch("/addtodisliked/:id", verifyJWT, updateUserAction); 
router.post('/refresh-token', RefreshAccessToken)
export default router