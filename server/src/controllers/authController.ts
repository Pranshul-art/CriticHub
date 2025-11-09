import zod from "zod";
import JWT from "jsonwebtoken";
import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const prisma= new PrismaClient();




//sign in logic
const signinBody=zod.object({
    email: zod.string().email(),
    password: zod.string()
})

interface SigninData {
    email:string,
    password: string
}

export const signin = async (req:Request, res:Response): Promise<void> =>{
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
    

    
        const user = await prisma.user.findUnique({
          where: { email }
        });
        if (!user) {
          res.status(401).json({
            success: false,
            message: "Unauthorized Access!"
          });
          return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          res.status(401).json({
            success: false,
            message: "Unauthorized Access!"
          });
          return;
        }
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
// user profile logic
export const profile=async(req:Request, res:Response): Promise<void>=>{
  try{
      const userId=req.userId as string;
      if(!userId){
        res.status(401).json({
            success:false,
            message:"Unauthorized"
        });
        return;
      }
      const user= await prisma.user.findUnique({
        where:{
          id:userId
        },
        select:{
          id:true,
          username: true,
          email: true,
          tag: true,
          age: true,
          gender: true,
          profileImage: true,
          bio: true,
          createdAt: true,
        }
      })
      if(!user){
        res.status(404).json({
          success:false,
          messsage:"User not found"
        })
        return;
      }
      res.json({
        success:true,
        data:user
      });

  }catch(err){
    res.status(500).json({
      success:false,
      message:"Failed to fetch profile info",
    })
  }
};

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

// Generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Fun, on-theme email template
function otpEmailTemplate(otp: string, username: string) {
  return `
    <div style="background: linear-gradient(135deg, #0f172a, #334155, #f87171); color: #fff; padding: 2rem; border-radius: 1rem; font-family: 'Segoe UI', sans-serif;">
      <h1 style="color: #f87171; text-align: center;">Welcome to CriticsHub, ${username}!</h1>
      <p style="font-size: 1.1rem; text-align: center;">
        You're one step away from joining the most vibrant community of critics and explorers!
      </p>
      <div style="background: #fff; color: #0f172a; margin: 2rem auto; width: fit-content; padding: 1rem 2rem; border-radius: 0.5rem; font-size: 2rem; font-weight: bold; letter-spacing: 0.2em;">
        ${otp}
      </div>
      <p style="text-align: center;">
        Enter this OTP to verify your email and unlock a world of honest reviews, hidden gems, and passionate discussions.<br>
        <b>Why CriticsHub?</b><br>
        <ul style="text-align: left; margin: 1rem auto; max-width: 400px;">
          <li>🌟 Trusted reviews from real explorers</li>
          <li>🎉 Fun, friendly, and inclusive community</li>
          <li>🏆 Be a trendsetter, not just a tourist</li>
        </ul>
        <br>
        <i>Because your voice deserves to be heard. Welcome aboard!</i>
      </p>
      <p style="text-align: center; color: #f87171; margin-top: 2rem;">
        If you did not request this, please ignore this email.
      </p>
    </div>
  `;
}

// Signup handler 
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
    tag: string
};
export const signup = async (req: Request, res:Response): Promise<void> => {
  const { email, username, password, age, gender, tag }:UserData = req.body;

  const response = Schema.safeParse({email, username, password, age, gender, tag});
  if(!response){
    res.status(400).json({
      success: false,
      message: "Invalid input data. Please check your credentials."
    });
    return; 
  }
  // Validate and hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save user with OTP (not verified yet)
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      age,
      gender,
      tag,
      otp,
      otpExpiresAt,
      verified: false,
    },
  });

  // Send OTP email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: '"CriticsHub" <pranshulgupta18@gmail.com>',
    to: email,
    subject: "Your CriticsHub OTP - Join the Best!",
    html: otpEmailTemplate(otp, username),
  });

  res.json({ success: true, message: "OTP sent to your email. Please verify to complete signup." });
};

// OTP verification endpoint
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(400).json({ success: false, message: "User not found." });
    return;
  }
  if (!user.otpExpiresAt || new Date() > user.otpExpiresAt) {
    res.status(400).json({ success: false, message: "OTP expired. Please request a new OTP." });
    return;
  }
  if (user.otp !== otp) {
    res.status(400).json({ success: false, message: "Invalid OTP." });
    return;
  }
  await prisma.user.update({
    where: { email },
    data: { verified: true, otp: null, otpExpiresAt: null },
  });

  // Generate JWT token
  const token = JWT.sign({ userId: user.id }, process.env.JWT_SECRET as string);

  res.json({
    success: true,
    message: "Email verified! Welcome to CriticsHub.",
    token,
    username: user.username,
  });
};

// Resend OTP endpoint
export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(400).json({ success: false, message: "User not found." });
    return;
  }
  // Generate new OTP and expiry
  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiresAt },
  });

  // Send OTP email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: '"CriticsHub" <pranshulgupta18@gmail.com>',
    to: email,
    subject: "Your CriticsHub OTP - Join the Best!",
    html: otpEmailTemplate(otp, user.username),
  });

  res.json({ success: true, message: "A new OTP has been sent to your email." });
};

// Optional: Delete user if they never verify (e.g., after X minutes or on frontend request)
export const deleteUnverifiedUser = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  await prisma.user.deleteMany({
    where: { email, verified: false },
  });
  res.json({ success: true, message: "Unverified user deleted." });
};