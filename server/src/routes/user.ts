import express from "express";
import { authMiddleware } from "../middleware/auth";
import { signin, signup, userDetails } from "../controllers/authController";
const userRouter = express.Router();



//To sign up 
userRouter.post("/signup", signup);

//To sign in
userRouter.post("/signin", signin);

// get the logged in user details
userRouter.get("/",authMiddleware, userDetails);

export { userRouter };