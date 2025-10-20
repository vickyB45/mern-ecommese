import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import CouponModel from "@/models/coupon.model";

export async function POST(req) {
  try {
    await connectDB();

    const { code, subtotal } = await req.json();

    if (!code || subtotal === undefined) {
      return response(false, 400, "Coupon code or subtotal is missing");
    }

    // ✅ Find coupon by code and check validity
    const coupon = await CouponModel.findOne({
      code: code.trim().toUpperCase(),
      deletedAt: null,
    }).lean();

    if (!coupon) {
      return response(false, 404, "Coupon not found");
    }

    // ✅ Check minimum shopping amount
    if (subtotal < coupon.minShoppingAmmount) {
      return response(
        false,
        400,
        `Cart total must be at least ₹${coupon.minShoppingAmmount} to use this coupon`
      );
    }

    // ✅ Check validity (using timestamps, assuming `validity` is in days)
    const createdAt = new Date(coupon.createdAt);
    const expiryDate = new Date(createdAt);
    expiryDate.setDate(expiryDate.getDate() + coupon.validity);

    if (new Date() > expiryDate) {
      return response(false, 400, "Coupon has expired");
    }

    // ✅ Calculate discount amount
    const discountAmount = (subtotal * coupon.discountPercentage) / 100;

    return response(true, 200, "Coupon applied successfully", {
      code: coupon.code,
      discountAmount,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    return catchError(error);
  }
}
