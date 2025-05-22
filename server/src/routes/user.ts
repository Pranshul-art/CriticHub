import express from "express";
import { authMiddleware } from "../middleware/auth";
import { signin, signup, userDetails } from "../controllers/authController";
import { follow, followers } from "../controllers/followController";
const userRouter = express.Router();



//To sign up 
userRouter.post("/signup", signup);

//To sign in
userRouter.post("/signin", signin);

// get the logged in user details
userRouter.get("/",authMiddleware, userDetails);

// user can follow one another
userRouter.post("/follow", authMiddleware, follow);

// get all followers
userRouter.get("/followers", authMiddleware, followers)
export { userRouter };