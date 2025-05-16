import express from "express";
import { authMiddleware } from "../middleware/auth";
import { category, featured, postView } from "../controllers/contentController";
import multer from "multer";
import { commentOnPost, createPost, GetAllComment } from "../controllers/postController";
import { CategoryController } from "../controllers/categoryController";

const postRouter= express.Router();

// Configure multer for file uploads
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 50 * 1024 * 1024, // 50 MB limit
    }
});


// featured content - latest, recent, and trending
postRouter.get("/featured", authMiddleware, featured);

// category specific content 
postRouter.get("/category/:categoryId", authMiddleware, category);



//get all categories
postRouter.get("/categories", authMiddleware, CategoryController);

// create a new post
postRouter.post("/create", authMiddleware, upload.single('media'), createPost);

// views for a post and update analytics
postRouter.post("/post/:postId/view", authMiddleware, postView);

// comment to a post
postRouter.post("/:postId/comments", authMiddleware, commentOnPost);

// get all comments
postRouter.get("/:postId/comments", authMiddleware, GetAllComment);


export { postRouter };