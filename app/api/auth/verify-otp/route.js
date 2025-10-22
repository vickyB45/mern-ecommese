import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { loginSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/otp.model";
import { userModel } from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse the request body
    const payload = await req.json();

    // Pick only OTP and email fields for validation
    const validationSchema = loginSchema.pick({ otp: true, email: true });
    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return response(false, 401, "Invalid or missing input field", validatedData.error);
    }

    const { email, otp } = validatedData.data;

    // Find OTP entry in DB
    const getOtpData = await OTPModel.findOne({ email, otp });
    if (!getOtpData) {
      return response(false, 404, "Invalid or expired OTP");
    }

    // Find the user
    const getUser = await userModel.findOne({ email, deletedAt: null }).lean();
    if (!getUser) {
      return response(false, 404, "User not found!");
    }

    // Prepare user data for token
    const loggedInUserData = {
      _id: getUser._id.toString(),
      role: getUser.role,
      name: getUser.name,
      avatar: getUser.avatar?.url || null, // fallback if avatar is missing
    };

    // Sign JWT
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT(loggedInUserData)
      .setIssuedAt()
      .setExpirationTime("24h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    // Set HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set({
      name: "access_token",
      value: token,
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    // Remove the used OTP
    await getOtpData.deleteOne();

    return response(true, 200, "Login successful", loggedInUserData);
  } catch (error) {
    console.error("Login error:", error);
    return catchError(error);
  }
}
