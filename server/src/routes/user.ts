import express from "express";
import { authMiddleware } from "../middleware/auth";
import { deleteUnverifiedUser, profile, resendOtp, signin, signup, userDetails, verifyOtp } from "../controllers/authController";
import { follow, followers } from "../controllers/followController";
const userRouter = express.Router();



//To sign up 
userRouter.post("/signup", signup);

//To sign in
userRouter.post("/signin", signin);

//to verify OPT
userRouter.post("/verify-otp", verifyOtp);

//to resend otp 
userRouter.post("resend-otp", resendOtp);

//to cleanup unverified users
userRouter.delete("/clear", deleteUnverifiedUser);

// get the logged in user details
userRouter.get("/",authMiddleware, userDetails);

//get profile info
userRouter.get("/profile", authMiddleware, profile);

// user can follow one another
userRouter.post("/follow", authMiddleware, follow);

// get all followers
userRouter.get("/followers", authMiddleware, followers);
export { userRouter };