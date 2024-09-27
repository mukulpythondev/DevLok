import { Router } from "express";
import { getUserDetails, Login, Logout, RefreshAccessToken, SignUp, verifyOTP } from "../controllers/userController.js";
import {verifyJWT} from "../middleware/authMiddleware.js"
const router= Router();


router.post("/signup", SignUp )
router.post("/verify-otp", verifyOTP)
router.post('/login', Login)
router.post('/logout', verifyJWT, Logout)
router.get("/user/details", verifyJWT, getUserDetails); 
router.post('/refresh-token', RefreshAccessToken)
export default router