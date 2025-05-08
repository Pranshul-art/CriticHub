import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, RequestHandler, Response } from "express";

//Request interface to include userId
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

dotenv.config();

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(403).json({success: false, message: "Unauthorized - no token provided"});
        return;
    }
    const token= authHeader.split(' ')[1];
    try{
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the environment variables.");
        }
        const decode = JWT.verify(token, process.env.JWT_SECRET);
        req.userId = (decode as { userId: string }).userId;
        next();
        
    }catch(error){
        res.status(403).json({success: false, message:"You are UnAuthorized! ",error});
    }
}