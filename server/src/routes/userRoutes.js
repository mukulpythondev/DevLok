import { Router } from "express";
import { getUserDetails, Login, Logout, RefreshAccessToken, SignUp } from "../controllers/userController.js";
import {verifyJWT} from "../middleware/authMiddleware.js"
const router= Router();


router.post("/signup", SignUp )
router.post('/login', Login)
router.post('/logout', Logout)
router.get("/user/details", verifyJWT, getUserDetails); 
router.post('/refresh-token', RefreshAccessToken)
export default router