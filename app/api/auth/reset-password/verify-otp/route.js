import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { loginSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/otp.model";
import { userModel } from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        await connectDB()
        const payload = await req.json()
        const validationSchema = loginSchema.pick({
            otp: true,
            email: true
        })

        const validatedData = validationSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 401, "Invalid or missing input field", validatedData.error)
        }
        const { email, otp } = validatedData.data

        const getOtpData = await OTPModel.findOne({ email, otp })

        if (!getOtpData) {
            return response(false, 404, "Invalid or Expire OTP")
        }
        const getUser = await userModel.findOne({ deletedAt: null, email }).lean()

        if (!getUser) {
            return response(false, 404, "User not found!")
        }
        
      
        // remove otp 
        await getOtpData.deleteOne()

        return response(true, 200, "OTP verified successfully")

    } catch (error) {

        return catchError(error);
    }
}
