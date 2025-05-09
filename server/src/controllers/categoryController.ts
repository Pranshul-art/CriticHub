import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma= new PrismaClient();

//get categories logic 
export const CategoryController= async (req:Request, res:Response)=>{
    try{
        const categories = await prisma.category.findMany({
            select:{
                id: true,
                name: true,
                description: true,
                icon: true
            }
        });
        //console.log("Fetched categories:", categories);
        const sanitizedCategories=categories.map((category)=>({
            ...category,
            icon: category.icon || '',
        }));
        res.status(200).json({
            success: true,
            data: sanitizedCategories,
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