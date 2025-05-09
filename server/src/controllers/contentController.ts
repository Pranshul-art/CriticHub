import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();


//featured content - latest, recent and trending logic

interface QueryParams{
    type?: string,
    limit?: string
}
export const featured= async (req: Request<any, any, any, QueryParams>, res: Response): Promise<void> => {
    try {
        const { type = 'all', limit = "10" } = req.query 
        const parsedLimit = parseInt(limit);
        
        let posts: Array<{
            id: string;
            title: string;
            content: string;
            postDate: Date;
            user: {
            id: string;
            username: string;
            tag: string;
            profileImage: string | null;
            isCritic: boolean;
            };
            category: {
            id: string;
            name: string;
            } | null;
            _count: {
            views: number;
            comments: number;
            };
        }> = [];
        const now = new Date();
        const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
    
        // For combined featured content
        if (type === 'all') {
          // Get latest posts
          const latestPosts = await prisma.post.findMany({
            take: Math.floor(parsedLimit / 3),
            orderBy: { postDate: 'desc' },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  tag: true,
                  profileImage: true,
                  isCritic: true
                }
              },
              category: true,
              _count: {
                select: {
                  views: true,
                  comments: true
                }
              }
            }
          });
          
          // Get trending posts (most views in last 7 days)
          const trendingPostIds = await prisma.view.groupBy({
            by: ['postId'],
            where: {
              timestamp: { gte: oneWeekAgo }
            },
            _count: {
              postId: true
            },
            orderBy: {
              _count: {
                postId: 'desc'
              }
            },
            take: Math.floor(parsedLimit / 3)
          });
    
          const trendingPosts = await prisma.post.findMany({
            where: {
              id: { in: trendingPostIds.map(p => p.postId) }
            },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  tag: true,
                  profileImage: true,
                  isCritic: true
                }
              },
              category: true,
              _count: {
                select: {
                  views: true,
                  comments: true
                }
              }
            }
          });
    
          // Get posts from critics
          const criticPosts = await prisma.post.findMany({
            where: {
              user: {
                isCritic: true
              }
            },
            take: Math.floor(parsedLimit / 3),
            orderBy: { postDate: 'desc' },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  tag: true,
                  profileImage: true,
                  isCritic: true
                }
              },
              category: true,
              _count: {
                select: {
                  views: true,
                  comments: true
                }
              }
            }
          });
    
          // Combine all types and remove duplicates
          const allPosts = [...latestPosts, ...trendingPosts, ...criticPosts];
          const uniquePostIds = new Set();
          
          posts = allPosts.filter(post => {
            if (uniquePostIds.has(post.id)) return false;
            uniquePostIds.add(post.id);
            return true;
          }).slice(0, parsedLimit);
    
        } else if (type === 'latest') {
          // Get only latest posts
          posts = await prisma.post.findMany({
            take: parsedLimit,
            orderBy: { postDate: 'desc' },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  tag: true,
                  profileImage: true,
                  isCritic: true
                }
              },
              category: true,
              _count: {
                select: {
                  views: true,
                  comments: true
                }
              }
            }
          });
        } else if (type === 'trending') {
          // Get only trending posts
          const trendingPostIds = await prisma.view.groupBy({
            by: ['postId'],
            where: {
              timestamp: { gte: oneWeekAgo }
            },
            _count: {
              postId: true
            },
            orderBy: {
              _count: {
                postId: 'desc'
              }
            },
            take: parsedLimit
          });
    
          posts = await prisma.post.findMany({
            where: {
              id: { in: trendingPostIds.map(p => p.postId) }
            },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  tag: true,
                  profileImage: true,
                  isCritic: true
                }
              },
              category: true,
              _count: {
                select: {
                  views: true,
                  comments: true
                }
              }
            }
          });
        }
    
        res.json({
          success: true,
          data: posts
        });
      } catch (error) {
        console.error('Error fetching featured content:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch featured content' });
      }
}


// category specific content logic
interface QueryParam{
    sort?: string,
    page?: string,
    limit?: string
}   
export const category = async (req: Request<any, any, any, QueryParam>, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.params; // Use categoryId from params
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