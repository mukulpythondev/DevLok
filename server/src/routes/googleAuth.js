import express from 'express';
import passport from '../utils/passport.js';
import { generateAcesstokenAndRefreshtoken } from '../controllers/userController.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const router = express.Router();

// Initiate Google Login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google Callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const user = req.user;

      // Generate Access Token and Refresh Token
      const { accessToken, refreshToken } = await generateAcesstokenAndRefreshtoken(user._id);

      // Set cookies (optional)
      const options = {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      };

      res.cookie('accessToken', accessToken, options);
      res.cookie('refreshToken', refreshToken, options);

      // Redirect to the desired frontend page
      const redirectUrl = `${process.env.FRONTEND_URL}/new`;
      res.redirect(redirectUrl);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=Something went wrong during Google login.`);
    }
  }
);

export default router;
