import zod from "zod";
import JWT from "jsonwebtoken";
import { Prisma, PrismaClient } from "../generated/prisma";
import { Request, Response } from "express";

const prisma= new PrismaClient();

//sign up logic
const Schema = zod.object({
    email: zod.string().email(),
    username: zod.string(),
    password: zod.string().min(6).max(12),
    age: zod.number(),
    gender: zod.string(),
    tag: zod.string().optional()
})
interface UserData{
    email: string,
    username: string,
    password: string,
    age: number,
    gender: string,
    tag?: string
};
export const signup= async (req:Request, res:Response): Promise<void>=>{
    const { email, username, password, age, gender, tag }:UserData  = req.body;
    const { success } = Schema.safeParse({
        email,
        username,
        password,
        age,
        gender,
        tag
    });

    if(!success){
        res.status(411).json({
            success:false,
            message:"Incorrect inputs"
        })
    }
    const existingUser= await prisma.user.findUnique({
        where:{
            email: email
        },
    });
    if(existingUser){
        res.status(403).json({
            success:false,
            message:"Email is already registered! SignIn into your Account"
        })
    }
    const User= await prisma.user.create({
        data: {
            email,
            username,
            password,
            tag: tag || "CriticsHub", 
            age, 
            gender
        }
    });
    const userId: string = User.id;
    console.log(`User created with ID: ${userId}`);

    const token = JWT.sign({ userId }, process.env.JWT_SECRET as string);
    res.status(200).json({
        success: true,
        message: "User created Successfully",
        token: token
    })
};


//sign in logic
const signinBody=zod.object({
    email: zod.string().email(),
    password: zod.string()
})

interface SigninData {
    email:string,
    password: string
}

export const signin = async (req:Request, res:Response) : Promise<void> =>{
    try{
        const { email , password }:SigninData = req.body;
        const response = signinBody.safeParse({
            email,
            password
        })

        if(!response){
            res.status(411).json({
                success:false,
                message: "Length error! Input the correct credentials"
            })
        }
    

    
        const user= await prisma.user.findUnique({
            where:{
                email,
                password
            }
        });
        if(user){
            const userId:string=user.id;
            const token=JWT.sign({userId},process.env.JWT_SECRET as string);
            res.status(200).json({
                success: true,
                message: "Logging In",
                token: token,
                username:user.username

            })
        }
    }catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error });
    }

    res.status(401).json({
        success: false,
        message: "Unauthorized Access!"
    })
}


// user details logic
export const userDetails=async(req:Request, res:Response): Promise<void>=>{
    try{
        const response = await prisma.user.findUnique({
            where: {
                id: req.userId as string
            }
        });
        res.status(200).json({
            success:true,
            message: "Successfully Retrieved the user data",
            username: response?.username,
            tag: response?.tag
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message: "Error while Fetching the user's Data",
            error:error
        })
    }
}