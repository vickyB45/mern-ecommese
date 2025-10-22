import { connectDB } from "@/lib/databaseConnection";
import { isAuthenticated } from "@/lib/authentication";
import { response, catchError } from "@/lib/helperFunctions";
import orderModel from "@/models/order.model";
import ProductModel from "@/models/product.model";
import ProductVariantModel from "@/models/product.variant";
import MediaModel from "@/models/media.model";

export async function GET(req, { params }) {
  try {
    await connectDB();

    // ✅ Authenticate user
    const auth = await isAuthenticated("user");

    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized");
    }

    // ✅ Extract userId safely
    let userId;
    if (auth.userId && auth.userId.buffer) {
      const bufferArray = Object.values(auth.userId.buffer);
      userId = Buffer.from(bufferArray).toString("hex");
    } else {
      userId = auth.userId?.toString();
    }

    // ✅ Await params before using
    const resolvedParams = await params;
    const { orderId } = resolvedParams;

    if (!orderId) {
      return response(false, 400, "Order ID is required");
    }

    // ✅ Fetch order with nested populate
    const query = auth.role === "admin" ? { orderId } : { orderId, user: userId };
const order = await orderModel.findOne(query)
  .populate({
    path: "products.variantId",
    select: "color size media",
    populate: { path: "media", select: "secure_url" },
  })
  .lean();



    if (!order) {
      return response(false, 404, "Order not found");
    }

    // ✅ Flatten products for frontend-friendly response
    const products = order.products.map((p, index) => {
      const variant = p.variantId || {};
      

      return {
        name: p.name,
        quantity: p.quantity,
        sellingPrice: p.sellingPrice,
        color: variant.color || "-",
        size: variant.size || "-",
        media: variant.media?.map((m) => m.secure_url) || [],
      };
    });

    const orderResponse = {
      ...order,
      products,
    };


    return response(true, 200, "Order details fetched successfully", orderResponse);
  } catch (error) {
    console.error("💥 Order fetch error:", error);
    return catchError(error);
  }
}
