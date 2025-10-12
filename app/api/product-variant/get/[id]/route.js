import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import ProductVariantModel from "@/models/product.variant";
import { isValidObjectId } from "mongoose";

export async function GET(req, { params }) {
  
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized.");

    await connectDB();

    const { id } = params; // ✅ no need for await

    if (!isValidObjectId(id)) return response(false, 400, "Invalid Object Id");

    const getProductVariant = await ProductVariantModel.findOne({ _id: id, deletedAt: null }).populate('media',"secure_url").lean();
    if (!getProductVariant) return response(false, 404, " Product Variant not found");

    return response(true, 200, "Product Variant fetched successfully", getProductVariant);
  } catch (error) {
    return catchError(error); // ✅ must return
  }
}
