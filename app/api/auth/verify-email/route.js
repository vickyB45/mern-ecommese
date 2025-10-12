import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { userModel } from "@/models/User.model";
import { jwtVerify } from "jose";
import { isValidObjectId } from "mongoose";

export async function POST(req) {
  try {
    await connectDB();

    // ✅ Correct way to read token from body
    const { token } = await req.json();

    if (!token) {
      return response(false, 400, "Missing token.");
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const decoded = await jwtVerify(token, secret);
    const userId = decoded.payload.userId;

    if (!isValidObjectId(userId)) {
      return response(false, 400, "Invalid UserId", userId);
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return response(false, 404, "User not found");
    }

    user.isEmailVarified = true;
    await user.save();

    return response(true, 200, "Email verification successful");
  } catch (error) {
    return catchError(error);
  }
}
