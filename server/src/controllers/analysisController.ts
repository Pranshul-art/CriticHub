import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//age group logic (values between 0-1)
interface QueryParams{
    userId?: string;
    categoryId?: string;
    days?: string;
    weeks?: string;
}
export const ageGroup = async (req: Request<{}, {}, {}, QueryParams>, res:Response):Promise<void>=>{
    try{
        const  userId = req.userId;
        if (!userId){
          res.status(401).json({ success: false, message: "Unauthorized"})
          return
        }
        const { categoryId, days = "30" } =req.query;
        const startDate= new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
        const filter = {
            date: { gte: startDate },
            ...(userId && { userId }),
            ...(categoryId && { categoryId })
        };
        const ageGroupData = await prisma.ageGroupAnalytics.groupBy({
            by: ['ageGroup'],
            where: filter,
            _sum: {
              viewCount: true
            }
        });
        const totalViews = ageGroupData.reduce((sum, group) => 
            sum + (group._sum.viewCount || 0), 0);
        
        const result: Record<'18-24' | '25-34' | '35-44' | '45+', number> = {
            '18-24': 0,
            '25-34': 0, 
            '35-44': 0,
            '45+': 0
          };
      
        if (totalViews > 0) {
            ageGroupData.forEach(group => {
              result[group.ageGroup as '18-24' | '25-34' | '35-44' | '45+'] = (group._sum.viewCount || 0) / totalViews;
            });
        }
      
        res.json({ 
            success: true, 
            data: result,
            totalSample: totalViews
        });
    }catch (error) {
        console.error('Error fetching age group analytics:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch age group analytics' });
    }
}


//gender analysis logic (values between 0-1)

export const gender = async(req:Request<{}, {}, {}, QueryParams>, res:Response):Promise<void>=>{
    try{
      const  userId = req.userId;
        if (!userId){
          res.status(401).json({ success: false, message: "Unauthorized"})
          return
        }
        const { categoryId, days = "30" } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
        const filter = {
            date: { gte: startDate },
            ...(userId && { userId }),
            ...(categoryId && { categoryId })
        };
        const genderData = await prisma.genderAnalytics.groupBy({
            by: ['gender'],
            where: filter,
            _sum: {
              viewCount: true
            }
        });
        const totalViews = genderData.reduce((sum, group) => 
            sum + (group._sum.viewCount || 0), 0);
        const result: Record<'male' | 'female' | 'other', number> = {
            male: 0,
            female: 0,
            other: 0
        };
        if (totalViews > 0) {
            genderData.forEach(group => {
              if (group.gender in result) {
                result[group.gender as 'male' | 'female' | 'other'] = (group._sum.viewCount || 0) / totalViews;
              }
            });
          }
      
        res.json({ 
        success: true, 
        data: result,
        totalSample: totalViews
        });
    }catch (error) {
        console.error('Error fetching gender analytics:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch gender analytics' });
    }
}


// total views, comments, posts dynamic logic 
export const totals = async (req: Request<{}, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const  userId = req.userId;
        if (!userId){
          res.status(401).json({ success: false, message: "Unauthorized"})
          return
        }
    const { categoryId, days = "7" } = req.query;

    // Filters for all time
    const postFilter: any = { ...(userId && { userId }), ...(categoryId && { categoryId }) };
    const likeFilter: any = { ...(userId && { post: { userId } }), ...(categoryId && { post: { categoryId } }) };
    const followerFilter: any = { ...(userId && { followingId: userId }) };

    // Calculate the start date for the selected period
    const periodAgo = new Date();
    periodAgo.setDate(periodAgo.getDate() - parseInt(days));

    // Current totals (all time)
    const [totalPosts, totalLikes, totalFollowers] = await Promise.all([
      prisma.post.count({ where: postFilter }),
      prisma.like.count({ where: likeFilter }),
      prisma.follower.count({ where: followerFilter }),
    ]);

    // Totals up to the start of the selected period
    const [postsPeriodAgo, likesPeriodAgo, followersPeriodAgo] = await Promise.all([
      prisma.post.count({ where: { ...postFilter, createdAt: { lt: periodAgo } } }),
      prisma.like.count({ where: { ...likeFilter, createdAt: { lt: periodAgo } } }),
      prisma.follower.count({ where: { ...followerFilter, createdAt: { lt: periodAgo } } }),
    ]);

    res.json({
      success: true,
      data: {
        totalPosts,
        totalLikes,
        totalFollowers,
        postsGrowth: totalPosts - postsPeriodAgo,
        likesGrowth: totalLikes - likesPeriodAgo,
        followersGrowth: totalFollowers - followersPeriodAgo,
        period: `${days} days`
      },
    });
  } catch (error) {
    console.error('Error fetching total analytics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch total analytics' });
  }
};


// daily interactions logic
export const dailyInteractions = async(req:Request<{}, {}, {}, QueryParams>, res:Response):Promise<void>=> {
    try {
      const  userId = req.userId;
        if (!userId){
          res.status(401).json({ success: false, message: "Unauthorized"})
          return
        }
        const { categoryId, weeks = "4" } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (parseInt(weeks) * 7));

        // Change: Use likes instead of views for engagement
        const likeFilter = {
          createdAt: { gte: startDate },
          post: {
            ...(userId && { userId }),
            ...(categoryId && { categoryId })
          }
        };

        const commentFilter = {
          createdAt: { gte: startDate },
          post: {
            ...(userId && { userId }),
            ...(categoryId && { categoryId })
          }
        };

        // Fetch all likes in this period
        const likes = await prisma.like.findMany({
          where: likeFilter,
          select: {
            createdAt: true
          }
        });

        // Fetch all comments in this period
        const comments = await prisma.comment.findMany({
          where: commentFilter,
          select: {
            createdAt: true
          }
        });

        // Initialize results object
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const result: Record<string, { likes: number; comments: number }> = days.reduce<Record<string, { likes: number; comments: number }>>((acc, day) => {
          acc[day] = { likes: 0, comments: 0 };
          return acc;
        }, {});

        // Count likes by day of week
        likes.forEach(like => {
          const dayOfWeek = days[new Date(like.createdAt).getDay()];
          result[dayOfWeek].likes++;
        });

        // Count comments by day of week
        comments.forEach(comment => {
          const dayOfWeek = days[new Date(comment.createdAt).getDay()];
          result[dayOfWeek].comments++;
        });

        res.json({
          success: true,
          data: result,
          period: `${weeks} weeks`
        });
    } catch (error) {
        console.error('Error fetching daily interactions:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch daily interaction analytics' });
    }
}


// demographics logic (age and gender)
export const demographics = async (req: Request<{}, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const  userId = req.userId;
        if (!userId){
          res.status(401).json({ success: false, message: "Unauthorized"})
          return
        }
    const { categoryId, days = "30" } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Fetch all likes in the period, joining user for age/gender
    const likes = await prisma.like.findMany({
      where: {
        createdAt: { gte: startDate },
        ...(userId && { post: { userId } }),
        ...(categoryId && { post: { categoryId } }),
      },
      include: {
        user: true,
      },
    });

    // Age group calculation
    const ageResult: Record<'18-24' | '25-34' | '35-44' | '45+', number> = {
      '18-24': 0,
      '25-34': 0,
      '35-44': 0,
      '45+': 0
    };
    let totalAgeLikes = 0;
    likes.forEach(like => {
      const age = like.user?.age;
      if (typeof age === "number") {
        if (age >= 18 && age <= 24) ageResult['18-24']++;
        else if (age >= 25 && age <= 34) ageResult['25-34']++;
        else if (age >= 35 && age <= 44) ageResult['35-44']++;
        else if (age >= 45) ageResult['45+']++;
        totalAgeLikes++;
      }
    });
    Object.keys(ageResult).forEach(key => {
      ageResult[key as keyof typeof ageResult] = totalAgeLikes ? ageResult[key as keyof typeof ageResult] / totalAgeLikes : 0;
    });

    // Gender calculation
    const genderResult: Record<'male' | 'female' | 'other', number> = {
      male: 0,
      female: 0,
      other: 0
    };
    let totalGenderLikes = 0;
    likes.forEach(like => {
      const gender = like.user?.gender?.toLowerCase();
      if (gender === "male" || gender === "female" || gender === "other") {
        genderResult[gender]++;
        totalGenderLikes++;
      } else if (gender) {
        genderResult.other++;
        totalGenderLikes++;
      }
    });
    Object.keys(genderResult).forEach(key => {
      genderResult[key as keyof typeof genderResult] = totalGenderLikes ? genderResult[key as keyof typeof genderResult] / totalGenderLikes : 0;
    });

    res.json({
      success: true,
      data: {
        age: ageResult,
        gender: genderResult
      },
      totalSample: {
        age: totalAgeLikes,
        gender: totalGenderLikes
      }
    });
  } catch (error) {
    console.error('Error fetching demographics analytics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch demographics analytics' });
  }
};