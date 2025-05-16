import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import multer from "multer";
import  cloudinary  from "../utils/cloudinary";
const prisma = new PrismaClient();


//Create a new post logic

interface postContent{
    title: string,
    content: string,
    location?: string,
    duration: string,
    categoryId: string,
    tags: string | Array<string>,
}

export const createPost = async(req:Request, res:Response):Promise<void>=>{
    try {
        const { 
          title, 
          content, 
          location, 
          duration, 
          categoryId, 
          tags 
        }:postContent = req.body;
        
        const userId = req.userId as string;

        if (!userId) {
          res.status(400).json({ 
            success: false, 
            message: 'User ID is required' 
          });
          return;
        }
    
        // Validate required fields
        if (!title || !content || !duration || !categoryId) {
           res.status(400).json({ 
            success: false, 
            message: 'Missing required fields' 
          });
          return;
        }
    
        const categoryExists = await prisma.category.findUnique({
          where: { id: categoryId }
        });
    
        if (!categoryExists) {
           res.status(400).json({ 
            success: false, 
            message: 'Invalid category' 
          });
          return;
        }
    
        // Handle media upload
        let uploadMedia = '';
        if (req.file) {
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload_stream({
            resource_type: 'auto', // auto-detect if it's an image or video
            folder: 'critic_posts',
          }, async (error: any, result: any) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              return res.status(500).json({ 
                success: false, 
                message: 'Failed to upload media' 
              });
            }
            
            uploadMedia = result.secure_url;
            
            // Create the post with uploaded media URL
            const parsedTags = Array.isArray(tags) ? tags : 
                              (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : []);
            
            const post = await prisma.post.create({
              data: {
                title,
                content,
                location: location || null,
                duration,
                categoryId,
                tags: Array.isArray(parsedTags) ? parsedTags : [],
                uploadMedia,
                userId
              }
            });
          
            const postCount = await prisma.post.count({
              where: { userId }
            });
            
            if (postCount >= 5) {
              await prisma.user.update({
                where: { id: userId },
                data: { isCritic: true }
              });
            }
          
            res.status(201).json({
              success: true,
              data: post,
              message: 'Post created successfully'
            });
          }).end(req.file.buffer);
        } else {
          // Create post without media
          const parsedTags = Array.isArray(tags) ? tags : 
                            (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : []);
          
          const post = await prisma.post.create({
            data: {
              title,
              content,
              location: location || null,
              duration,
              categoryId,
              tags: parsedTags,
              uploadMedia: '',
              userId
            }
          });
        
          // If the user isn't already a critic and has 5+ posts, make them a critic
          const postCount = await prisma.post.count({
            where: { userId }
          });
          
          if (postCount >= 5) {
            await prisma.user.update({
              where: { id: userId },
              data: { isCritic: true }
            });
          }
        
          res.status(201).json({
            success: true,
            data: post,
            message: 'Post created successfully'
          });
        }
      } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ success: false, message: 'Failed to create post' });
      }
}

//comment to a post logic
export const commentOnPost=async (req:Request, res:Response):Promise<void>=>{
    try {
        const { postId } = req.params;
        const { comment } = req.body;
        const userId = req.userId as string;

        if (!userId) {
          res.status(400).json({ 
            success: false, 
            message: 'User ID is required' 
          });
          return;
        }
        
        if (!comment) {
           res.status(400).json({ 
            success: false, 
            message: 'Comment text is required' 
          });
          return;
        }
        
        // Check if post exists
        const post = await prisma.post.findUnique({
          where: { id: postId }
        });
        
        if (!post) {
           res.status(404).json({ 
            success: false, 
            message: 'Post not found' 
          });
          return;
        }
        
        const newComment = await prisma.comment.create({
          data: {
            comment,
            userId,
            postId
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                tag: true,
                profileImage: true
              }
            }
          }
        });
        
        res.status(201).json({
          success: true,
          data: newComment,
          message: 'Comment added successfully'
        });
      } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ success: false, message: 'Failed to add comment' });
      }
}

//get all comments logic
export const GetAllComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found'
      });
      return;
    }

    // Fetch all comments for the post, include user info
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        comment: true, // <-- This ensures the comment text is included
        createdAt: true,
        userId: true,
        user: {
          select: {
            id: true,
            username: true,
            verified: true,
            isCritic: true,
            profileImage: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: comments,
      message: 'Comments fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch comments' });
  }
};