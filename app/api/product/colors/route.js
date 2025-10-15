import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import ProductVariantModel from "@/models/product.variant";

export const GET = async () => {
  try {
    // ✅ Connect to DB
    await connectDB();

    // ✅ Fetch distinct color values only (faster than full find)
    const colors = await ProductVariantModel.distinct("color", { deletedAt: null });

    // ✅ Check if colors exist
    if (!colors?.length) {
      return response(false, 404, "No colors found");
    }

    // ✅ Success response
    return response(true, 200, "Colors fetched successfully", colors);

  } catch (error) {
    console.error("GET /api/product-variant/colors →", error);
    return catchError(error);
  }
};
