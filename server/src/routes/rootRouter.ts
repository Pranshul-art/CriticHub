import express  from "express";
import { userRouter } from "./user";
import { analyticsRouter } from "./analytics";
import { postRouter } from "./post";
const rootRouter=express.Router();


rootRouter.use("/user", userRouter); 
rootRouter.use("/analytics", analyticsRouter);
rootRouter.use("/content", postRouter);
rootRouter.get("/test", (req, res) => {
    res.send("Root router is working");
});
export { rootRouter };