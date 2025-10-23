import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunctions";
import { sendMail } from "@/lib/sendMail";
import { loginSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/otp.model";
import { userModel } from "@/models/User.model";
import { SignJWT } from "jose";
import z from "zod";

export async function POST(req){
try{
    await connectDB()
    const payload = await req.json()
    const velidationSchema = loginSchema.pick({
        email:true,
    }).extend({
        password:z.string()
    })
    const validatedData = velidationSchema.safeParse(payload)
    if(!validatedData.success){
        return response(false,401,"Invalid or misstion input fields", validatedData.error)
    }
    
    const {email,password} = validatedData.data

    
    const getUser =  await userModel.findOne({deletedAt: null, email}).select("+password")
    
    if(!getUser){
        return response(false,404,"Invalid Login Credentials", validatedData.error)
    }
    
if(!getUser.isEmailVarified){
     const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = await new SignJWT({ userId: getUser._id.toString() })
          .setIssuedAt()
          .setExpirationTime("1h")
          .setProtectedHeader({ alg: "HS256" }) // 🔥 Correct alg (uppercase)
          .sign(secret);
    
        // ✅ 6. Send verification email
        const verifyLink = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-email/${token}`;
        await sendMail(
          "Email Verification request from Developer Vicky",
          email,
          emailVerificationLink(verifyLink)
        );

        
        return response(false,401,"Your email is not verified. we have send a verification code in your registered email address")
}
    

    const isPasswordVerified = await getUser.comparePassword(password)
    if(!isPasswordVerified){
        return response(false,400,"Invalid Login Credentials", validatedData.error)
    }
    
    //OTP generate
    await OTPModel.deleteMany({email})
    
    const otp = generateOTP()

    // store otp database 
    const newOTPData = await OTPModel({
        email,otp
    })

    await newOTPData.save()

    const otpEmailStatus = await sendMail("Your login verification code",email,otpEmail(otp))
    if(!otpEmailStatus.success){
        return response(false,400,"Faild to send OTP.")
    }
    return response(true,200,"Login success. Please check your email")
}
catch(error){
    return catchError(error)
}
}