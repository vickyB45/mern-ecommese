import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import orderModel from "@/models/order.model";
import MediaModel from "@/models/media.model";
import ProductModel from "@/models/product.model";
import ProductVariantModel from "@/models/product.variant";

export async function GET(request) {
    
  try {
    await connectDB();
    const auth = await isAuthenticated("user"); 
    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized");
    }

    // ✅ Handle the buffer object: Convert to array, then to Buffer, then to hex string
    let userId;
    if (auth.userId && auth.userId.buffer) {
      // Extract values from the object into an array (e.g., [104, 227, ...])
      const bufferArray = Object.values(auth.userId.buffer);
      // Create Buffer from array and convert to hex string
      userId = Buffer.from(bufferArray).toString("hex");
    } else {
      userId = auth.userId?.toString();  // Fallback (unlikely needed)
    }
    

    // Get recent orders
    const orders = await orderModel
      .find({ user: userId })  // Use the hex string directly
      .populate("products.productId", "name slug")
      .populate({
        path: "products.variantId",
        populate: { path: "media" },
      })
      .sort({ createdAt: -1 })
      .lean();


    return response(true, 200, "Order Info", { orders });
  } catch (error) {
    console.error("Backend error:", error);
    return catchError(error);
  }
}
