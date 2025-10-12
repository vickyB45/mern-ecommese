import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { isAuthenticated } from "@/lib/authentication";
import { loginSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/coupon.model";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated(request);
    if (!auth) return response(false, 403, "Unauthorized");

    await connectDB();

    const payload = await request.json();

const schema = loginSchema.pick({
  _id:true,
  code:true,
  discountPercentage: true,
  minShoppingAmmount:true,
  validity:true
});


    const validatedData = schema.safeParse(payload);
    if (!validatedData.success)
      return response(false, 422, "Invalid form data", validatedData.error);

    const couponData = validatedData.data;

    const getCoupon = await CouponModel.findOne({ deletedAt: null,_id: couponData._id });
    if (!getCoupon) return response(false, 404, "Data not found");

    // ✅ Update name and regenerate slug automatically
   getCoupon.code = couponData.code,
  getCoupon.discountPercentage =  couponData.discountPercentage,
  getCoupon.minShoppingAmmount = couponData.minShoppingAmmount,
  getCoupon.validity = couponData.validity
  
    await getCoupon.save(); // ✅ persist changes

    // ✅ Return updated category so frontend can update cache immediately
    return response(true, 200, "Coupon Updated successfully", getCoupon);
  } catch (error) {
    return catchError(error);
  }
}
