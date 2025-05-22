import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

// follow logic -
//     - one user cannot follow himself
//     - if the user if already following someone it will unfollow him 
export const follow = async (req: Request, res: Response): Promise<void> => {
  try {
    const { followingId } = req.body; // ID of the user to follow/unfollow
    const followerId = req.userId; // ID of the logged-in user (follower)

    // Check if followerId and followingId are provided
    if (!followerId || !followingId) {
      res.status(400).json({ success: false, message: "Invalid request. Missing user IDs." });
      return;
    }

    // Prevent a user from following themselves
    if (followerId === followingId) {
      res.status(400).json({ success: false, message: "You cannot follow yourself." });
      return;
    }

    // Check if the user is already following the target user
    const existingFollow = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      // If already following, unfollow the user
      await prisma.follower.delete({
        where: {
          id: existingFollow.id,
        },
      });
      res.status(200).json({ success: true, message: "Unfollowed the user successfully." });
    } else {
      // If not following, create a new follow relationship
      await prisma.follower.create({
        data: {
          followerId,
          followingId,
        },
      });
      res.status(200).json({ success: true, message: "Followed the user successfully." });
    }
  } catch (error) {
    console.error("Error in follow/unfollow logic:", error);
    res.status(500).json({ success: false, message: "An error occurred while processing the request." });
  }
};


// get all followers logic 
export const followers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(400).json({ success: false, message: "Missing user ID." });
      return;
    }

    const followers = await prisma.follower.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            profileImage: true,
            tag: true,
            isCritic: true,
            verified: true,
          },
        },
      },
    });

    // Map to flatten the structure for frontend
    const formatted = followers.map(f => ({
      id: f.follower.id,
      username: f.follower.username,
      profileImage: f.follower.profileImage,
      tag: f.follower.tag,
      isCritic: f.follower.isCritic,
      isVerified: f.follower.verified,
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch followers" });
  }
};