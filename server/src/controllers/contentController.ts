import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();


//featured content - latest, recent and trending logic

interface QueryParams {
  type?: string,
  limit?: string,
  page?: string
}

export const featured = async (req: Request<any, any, any, QueryParams>, res: Response): Promise<void> => {
  try {
    const { type = 'all', limit = "10", page = "1" } = req.query;
    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const skip = (parsedPage - 1) * parsedLimit;
    const currentUserId: string | undefined = req.userId;

    if (type === 'all') {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Fetch more than needed from each category to ensure enough after deduplication
      const fetchCount = parsedLimit * 3;

      // Latest
      const latestPosts = await prisma.post.findMany({
        orderBy: { postDate: 'desc' },
        take: fetchCount,
        include: {
          user: { select: { id: true, username: true, tag: true, profileImage: true, isCritic: true } },
          category: true,
          _count: { select: { views: true, comments: true } },
        },
      });

      // Trending (most views in last 7 days)
      const trendingPostIds = await prisma.view.groupBy({
        by: ['postId'],
        where: { timestamp: { gte: oneWeekAgo } },
        _count: { postId: true },
        orderBy: { _count: { postId: 'desc' } },
        take: fetchCount,
      });
      const trendingPosts = await prisma.post.findMany({
        where: { id: { in: trendingPostIds.map((p) => p.postId) } },
        include: {
          user: { select: { id: true, username: true, tag: true, profileImage: true, isCritic: true } },
          category: true,
          _count: { select: { views: true, comments: true } },
        },
      });

      // Critics
      const criticPosts = await prisma.post.findMany({
        where: { user: { isCritic: true } },
        orderBy: { postDate: 'desc' },
        take: fetchCount,
        include: {
          user: { select: { id: true, username: true, tag: true, profileImage: true, isCritic: true } },
          category: true,
          _count: { select: { views: true, comments: true } },
        },
      });

      // Combine and deduplicate
      const allPosts = [...latestPosts, ...trendingPosts, ...criticPosts];
      const uniquePostsMap = new Map();
      allPosts.forEach(post => {
        if (!uniquePostsMap.has(post.id)) uniquePostsMap.set(post.id, post);
      });
      const uniquePosts = Array.from(uniquePostsMap.values());

      // Pagination
      const paginatedPosts = uniquePosts.slice(skip, skip + parsedLimit);

      // Total count for pagination
      const totalPosts = uniquePosts.length;

      // Add isFollowed
      let postsWithFollow = paginatedPosts;
      if (currentUserId) {
        const followedUsers = await prisma.follower.findMany({
          where: {
            followerId: currentUserId,
            followingId: { in: paginatedPosts.map((post) => post.user.id) },
          },
          select: { followingId: true },
        });
        const followedUserIds = new Set(followedUsers.map(f => f.followingId));
        postsWithFollow = paginatedPosts.map(post => ({
          ...post,
          user: {
            ...post.user,
            isFollowed: post.user.id !== currentUserId && followedUserIds.has(post.user.id),
          },
        }));
      } else {
        postsWithFollow = paginatedPosts.map(post => ({
          ...post,
          user: { ...post.user, isFollowed: false },
        }));
      }

      res.json({
        success: true,
        data: postsWithFollow,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          totalItems: totalPosts,
          totalPages: Math.ceil(totalPosts / parsedLimit),
        },
      });
      return;
    } else if (type === 'latest') {
      // Get only latest posts
      let posts = (await prisma.post.findMany({
        take: parsedLimit,
        orderBy: { postDate: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              tag: true,
              profileImage: true,
              isCritic: true,
            },
          },
          category: true,
          _count: {
            select: {
              views: true,
              comments: true,
            },
          },
        },
      })).map((post) => ({
        ...post,
        user: {
          ...post.user,
          isFollowed: false, // Default value for isFollowed
        },
      }));

      res.json({
        success: true,
        data: posts,
        // add pagination if needed
      });
      return;
    } else if (type === 'trending') {
      // Get only trending posts
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const trendingPostIds = await prisma.view.groupBy({
        by: ['postId'],
        where: {
          timestamp: { gte: oneWeekAgo },
        },
        _count: {
          postId: true,
        },
        orderBy: {
          _count: {
            postId: 'desc',
          },
        },
        take: parsedLimit,
      });

      let posts = (await prisma.post.findMany({
        where: {
          id: { in: trendingPostIds.map((p) => p.postId) },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              tag: true,
              profileImage: true,
              isCritic: true,
            },
          },
          category: true,
          _count: {
            select: {
              views: true,
              comments: true,
            },
          },
        },
      })).map((post) => ({
        ...post,
        user: {
          ...post.user,
          isFollowed: false, // Default value for isFollowed
        },
      }));

      res.json({
        success: true,
        data: posts,
        // add pagination if needed
      });
      return;
    }

    // Add "isFollowed" field for each post's user
    let posts: any[] = [];
    // posts will only be used if type is not 'all', 'latest', or 'trending'
    // so we need to ensure it's defined to avoid TS error
    if (currentUserId) {
      const followedUsers = await prisma.follower.findMany({
        where: {
          followerId: currentUserId,
          followingId: { in: posts.map((post) => post.user.id) },
        },
        select: {
          followingId: true,
        },
      });

      const followedUserIds = new Set(followedUsers.map((follow) => follow.followingId));

      posts = posts.map((post) => ({
        ...post,
        user: {
          ...post.user,
          isFollowed: post.user.id !== currentUserId && followedUserIds.has(post.user.id),
        },
      }));
    } else {
      posts = posts.map((post) => ({
        ...post,
        user: {
          ...post.user,
          isFollowed: false,
        },
      }));
    }

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    // Only send a response if one hasn't been sent yet!
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Error fetching featured content" });
    }
    // Optionally log the error
    console.error("Error fetching featured content:", error);
  }
};


// category specific content logic
interface QueryParam{
    sort?: string,
    page?: string,
    limit?: string
}   
export const category = async (req: Request<any, any, any, QueryParam>, res: Response): Promise<void> => {
  try {
    const { categoryId }: { categoryId: string } = req.params; 
    const { sort = 'latest', page = '1', limit = "10" } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId, 
      },
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: `Category not found`,
      });
      return;
    }

    let orderBy = {};
    if (sort === 'popular') {
      // Fetch popular posts based on views
      const popularPostIds = await prisma.view.groupBy({
        by: ['postId'],
        where: {
          post: {
            categoryId: category.id,
          },
        },
        _count: {
          postId: true,
        },
        orderBy: {
          _count: {
            postId: 'desc',
          },
        },
        skip,
        take: parsedLimit,
      });

      const posts = await prisma.post.findMany({
        where: {
          id: { in: popularPostIds.map((p) => p.postId) },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              tag: true,
              profileImage: true,
              isCritic: true,
            },
          },
          category: true,
          _count: {
            select: {
              views: true,
              comments: true,
            },
          },
        },
      });

      // Total count for pagination
      const totalPosts = await prisma.post.count({
        where: {
          categoryId: category.id,
        },
      });

      res.json({
        success: true,
        data: posts,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          totalItems: totalPosts,
          totalPages: Math.ceil(totalPosts / parsedLimit),
        },
      });
      return;
    } else {
      orderBy = { postDate: 'desc' };
    }

    // Standard query with pagination
    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where: {
          categoryId: category.id,
        },
        orderBy,
        skip,
        take: parsedLimit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              tag: true,
              profileImage: true,
              isCritic: true,
            },
          },
          category: true,
          _count: {
            select: {
              views: true,
              comments: true,
            },
          },
        },
      }),
      prisma.post.count({
        where: {
          categoryId: category.id,
        },
      }),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        totalItems: totalPosts,
        totalPages: Math.ceil(totalPosts / parsedLimit),
      },
    });
  } catch (error) {
    console.error('Error fetching category content:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch category content' });
  }
};

//view for a post and update analytics logic
export const postView= async(req:Request, res:Response)=>{
    try {
        const { postId } = req.params;
        const { userId } = req.body;
        
        const post = await prisma.post.findUnique({
          where: { id: postId },
          select: { id: true, categoryId: true, userId: true }
        });
        
        if (!post) {
           res.status(404).json({ success: false, message: 'Post not found' });
           return;
        }
        
        await prisma.view.create({
          data: {
            postId,
            userId: userId || null
          }
        });
        
        if (userId) {
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { age: true, gender: true }
          });
          
          if (user) {
            let ageGroup = '45+';
            if (user.age < 25) ageGroup = '18-24';
            else if (user.age < 35) ageGroup = '25-34';
            else if (user.age < 45) ageGroup = '35-44';
            
            // Updated age group analytics
            await prisma.ageGroupAnalytics.upsert({
              where: {
                id: `${postId}-${ageGroup}-${new Date().toISOString().split('T')[0]}`
              },
              update: {
                viewCount: { increment: 1 }
              },
              create: {
                id: `${postId}-${ageGroup}-${new Date().toISOString().split('T')[0]}`,
                postId: postId,
                userId: post.userId,
                categoryId: post.categoryId,
                ageGroup: ageGroup,
                viewCount: 1
              }
            }).catch(e => console.error('Error updating age analytics:', e));
            
            // Updated gender analytics
            await prisma.genderAnalytics.upsert({
              where: {
                id: `${postId}-${user.gender}-${new Date().toISOString().split('T')[0]}`
              },
              update: {
                viewCount: { increment: 1 }
              },
              create: {
                id: `${postId}-${user.gender}-${new Date().toISOString().split('T')[0]}`,
                postId: postId,
                userId: post.userId,
                categoryId: post.categoryId,
                gender: user.gender,
                viewCount: 1
              }
            }).catch(e => console.error('Error updating gender analytics:', e));
          }
        }
        
        res.json({ success: true, message: 'View recorded successfully' });
      } catch (error) {
        console.error('Error recording view:', error);
        res.status(500).json({ success: false, message: 'Failed to record view' });
      }
}