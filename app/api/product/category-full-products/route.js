import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import CategoryModel from "@/models/category.model"; 
import MediaModel from "@/models/media.model";
import ProductModel from "@/models/product.model";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const categoryName = searchParams.get("category");

    let filter = { deletedAt: null };

    // ✅ Filter by category if passed
    if (categoryName) {
      const category = await CategoryModel.findOne({
        name: { $regex: new RegExp("^" + categoryName.trim() + "$", "i") },
      }).lean();

      if (!category) {
        return response(false, 404, "Category not found");
      }

      filter.category = category._id;
    }

    // ✅ Find only latest 4 products (newly added)
    const products = await ProductModel.find(filter)
      .populate("media", "secure_url")
      .populate("category", "name")
      .sort({ createdAt: -1 }) // 👈 Latest products first
      .lean();

    if (!products || products.length === 0)
      return response(false, 404, "No products found");

    return response(true, 200, "Products fetched successfully", products);
  } catch (error) {
    return catchError(error);
  }
}
