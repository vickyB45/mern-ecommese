import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import orderModel from "@/models/order.model";

export async function GET() {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

   const latestOrder = await orderModel.find({deletedAt:null}).sort({createdAt:-1}).limit(20).lean()
    return response(true, 200, "Latest order found successfully", latestOrder);
  } catch (error) {
    return catchError(error);
  }
}
