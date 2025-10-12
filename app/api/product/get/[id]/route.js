import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import MediaModel from "@/models/media.model";
import ProductModel from "@/models/product.model";
import { isValidObjectId } from "mongoose";

export async function GET(req, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized.");

    await connectDB();

    const { id } = params; // ✅ no need for await

    if (!isValidObjectId(id)) return response(false, 400, "Invalid Object Id");

    const product = await ProductModel.findOne({ _id: id, deletedAt: null }).populate('media',"secure_url").lean();
    if (!product) return response(false, 404, "product not found");

    return response(true, 200, "product fetched successfully", product);
  } catch (error) {
    return catchError(error); // ✅ must return
  }
}
