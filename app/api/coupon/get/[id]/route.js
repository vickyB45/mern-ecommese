import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import CouponModel from "@/models/coupon.model";
import { isValidObjectId } from "mongoose";

export async function GET(req, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized.");

    await connectDB();

    const { id } = params; // ✅ no need for await

    if (!isValidObjectId(id)) return response(false, 400, "Invalid Object Id");

    const Coupon = await CouponModel.findOne({ _id: id, deletedAt: null }).lean();
    if (!Coupon) return response(false, 404, "Coupon not found");

    return response(true, 200, "Coupon fetched successfully", Coupon);
  } catch (error) {
    return catchError(error); // ✅ must return
  }
}
