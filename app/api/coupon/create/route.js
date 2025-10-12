import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";

import { isAuthenticated } from "@/lib/authentication";
import { loginSchema } from "@/lib/zodSchema";
import { encode } from "entities";
import CouponModel from "@/models/coupon.model";


export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const payload = await request.json();

const schema = loginSchema.pick({
  code:true,
  discountPercentage: true,
  minShoppingAmmount:true,
  validity:true
});


    const validatedData = schema.safeParse(payload);
    if (!validatedData.success) {
      return response(false, 422, "Invalid form data", validatedData.error);
    }

    const couponData = validatedData.data

    const newCoupon = new CouponModel({
      code : couponData.code,
      discountPercentage : couponData.discountPercentage,
      minShoppingAmmount : couponData.minShoppingAmmount,
      validity : couponData.validity,

    });

    await newCoupon.save();

    return response(true, 200, "Coupon created successfully");
  } catch (error) {
    return catchError(error);
  }
}
