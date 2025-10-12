import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunctions";
import { sendMail } from "@/lib/sendMail";
import { loginSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/otp.model";
import { userModel } from "@/models/User.model";

export async function POST(req){
    try{
        await connectDB()
        const payload = await req.json()
        const validationSchema = loginSchema.pick({
            email:true
        })

        const validatedData = validationSchema.safeParse(payload)
        if(!validatedData.success){
            return response(false, 401, "Invalid or missing input field", validatedData.error)
        }
        
        const {email} = validatedData.data
        const getUser = await userModel.findOne({deletedAt:null, email}).lean()
        
        if(!getUser){
            return response(false, 404, "User not found!")
        }

         // Remove old OTPs for this email
            await OTPModel.deleteMany({ email });
        
            const otp = generateOTP();
        
            const newOtpData = new OTPModel({
              email,
              otp,
            });
        
            await newOtpData.save();
        
            const otpSendStatus = await sendMail(
              "Your Login Verification Code",
              email,
              otpEmail(otp)
            );
        
            if (!otpSendStatus || !otpSendStatus.success) {
              return response(false, 400, "Failed to resend OTP");
            }
        
            return response(true, 200, "Please verify your Account.");
        
    }catch(error){
        catchError(error)
    }
}