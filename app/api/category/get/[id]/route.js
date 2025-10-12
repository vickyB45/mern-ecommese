import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import CategoryModel from "@/models/category.model";
import { isValidObjectId } from "mongoose";

export async function GET(req, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized.");

    await connectDB();

    const { id } = params; // ✅ no need for await

    if (!isValidObjectId(id)) return response(false, 400, "Invalid Object Id");

    const category = await CategoryModel.findOne({ _id: id, deletedAt: null }).lean();
    if (!category) return response(false, 404, "Category not found");

    return response(true, 200, "Category fetched successfully", category);
  } catch (error) {
    return catchError(error); // ✅ must return
  }
}
