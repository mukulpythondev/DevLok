import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser';
import userRouter from "./routes/userRoutes.js"
import googleRouter from "./routes/googleAuth.js"
import passport from './utils/passport.js';
const app= express()
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize());
app.use("/api/v1/users",  userRouter )
app.use("/api/v1/auth", googleRouter)

export default app;