import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
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
        const { userId, categoryId, days = "30" } =req.query;
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
        const { userId, categoryId, days = "30" } = req.query;
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
export const totals = async(req:Request<{}, {},{}, QueryParams>, res:Response):Promise<void>=>{
    try {
        const { userId, categoryId, days = "30" } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
    
        const postFilter = {
          postDate: { gte: startDate },
          ...(userId && { userId }),
          ...(categoryId && { categoryId })
        };
        
        const viewFilter = {
          timestamp: { gte: startDate },
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
    
        // Execute all queries in parallel for better performance
        const [totalPosts, totalViews, totalComments] = await Promise.all([
          prisma.post.count({ where: postFilter }),
          prisma.view.count({ where: viewFilter }),
          prisma.comment.count({ where: commentFilter })
        ]);
        res.json({
          success: true,
          data: {
            totalPosts,
            totalViews,
            totalComments
          }
        });
      } catch (error) {
        console.error('Error fetching total analytics:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch total analytics' });
      }
}


// daily interactions logic
export const dailyInteractions = async(req:Request<{}, {}, {}, QueryParams>, res:Response):Promise<void>=>{
    try {
        const { userId, categoryId, weeks = "4" } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (parseInt(weeks) * 7));
    
        const viewFilter = {
          timestamp: { gte: startDate },
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
    
        // Fetch all views in this period
        const views = await prisma.view.findMany({
          where: viewFilter,
          select: {
            timestamp: true
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
        const result: Record<string, { views: number; comments: number }> = days.reduce<Record<string, { views: number; comments: number }>>((acc, day) => {
          acc[day] = { views: 0, comments: 0 };
          return acc;
        }, {});
    
        // Count views by day of week
        views.forEach(view => {
          const dayOfWeek = days[new Date(view.timestamp).getDay()];
          result[dayOfWeek].views++;
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