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
        
        const loggedInUserData = {
            _id:getUser._id,
            role:getUser.role,
            name:getUser.name,
            avatar:getUser.avatar
        }

        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const token = await new SignJWT(loggedInUserData).setIssuedAt().setExpirationTime("24h").setProtectedHeader({alg:'HS256'}).sign(secret)

        const cookieStore = await cookies()

        cookieStore.set({
            name:"access_token",
            value:token,
            httpOnly:process.env.NODE_ENV  === "production",
            path:"/",
            secure:process.env.NODE_ENV === "production",
            sameSite:"lax"
        })
        // remove otp 
        await getOtpData.deleteOne()

        return response(true, 200, "Login Successfully",loggedInUserData)

    } catch (error) {

        return catchError(error);
    }
}
