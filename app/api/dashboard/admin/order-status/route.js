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

    const orderStatus = await orderModel.aggregate([
      { $match: { deletedAt: null } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }, // Descending (most to least)
    ]);

    return response(true, 200, "Order data fetched successfully", orderStatus);
  } catch (error) {
    return catchError(error);
  }
}
