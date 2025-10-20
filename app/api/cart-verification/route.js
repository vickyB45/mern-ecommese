import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import ProductModel from "@/models/product.model";
import ProductVariantModel from "@/models/product.variant";
import MediaModel from "@/models/media.model"; // ensure Media schema is registered for populate



export async function POST(req) {
  try {
    await connectDB();

    // extract products array
    const payload = (await req.json()).products;

    if (!Array.isArray(payload)) {
      console.error("Payload is not an array!");
      return response(false, 400, "Invalid payload. Expected an array of cart items.");
    }

    const verifiedCartData = await Promise.all(
      payload.map(async (cartItem) => {
        const variant = await ProductVariantModel.findById(cartItem.variantId)
          .populate("product")
          .populate("media", "secure_url")
          .lean();

        if (variant && variant.product) {
          return {
            productId: variant.product._id,
            variantId: variant._id,
            name: variant.product.name,
            url: variant.product.slug,
            size: variant.size,
            color: variant.color,
            mrp: variant.product.mrp,
            sellingPrice: variant.product.sellingPrice,
            media: variant.media?.[0]?.secure_url || null,
            quantity: cartItem.quantity,
          };
        } else {
          return null;
        }
      })
    );

    const filteredData = verifiedCartData.filter(Boolean);

    return response(true, 200, "Verified Cart Data", filteredData);
  } catch (error) {
    console.error("POST /verify-cart error:", error);
    return catchError(error);
  }
}
