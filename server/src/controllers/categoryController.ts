import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma= new PrismaClient();

//get categories logic 
export const CategoryController= async (req:Request, res:Response)=>{
    try{
        const categories = await prisma.category.findMany();
        
        res.status(200).json({
            success: true,
            data: categories,
            message: "Categories fetched successfully"
        });
    }catch(err){
        console.log("Error fetching categories:", err);
        res.status(500).json({
            success:false,
            message:"Failed to fetch categories",
        });
    }
};