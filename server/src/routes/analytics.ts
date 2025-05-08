import  express  from "express";
import { authMiddleware } from "../middleware/auth";
import { ageGroup, dailyInteractions, gender, totals } from "../controllers/analysisController";

const analyticsRouter= express.Router();

// age group analysis
analyticsRouter.get("/age-group", authMiddleware, ageGroup);

//gender group analysis
analyticsRouter.get("/gender", authMiddleware, gender);

//total views, posts and comments
analyticsRouter.get("/totals",authMiddleware, totals);

//each day interaction
analyticsRouter.get("/daily-interactions", authMiddleware, dailyInteractions);


export { analyticsRouter };