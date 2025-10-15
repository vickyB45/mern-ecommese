import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import CategoryModel from "@/models/category.model";

export const GET = async () => {
  try {
    // ✅ Ensure database connection
    await connectDB();

    // ✅ Fetch active categories only
    const categories = await CategoryModel.find({ deletedAt: null }).lean();

    // ✅ Handle no data found
    if (!categories?.length) {
      return response(false, 404, "No categories found");
    }

    // ✅ Successful response
    return response(true, 200, "Categories fetched successfully", categories);

  } catch (error) {
    // ✅ Log + handle error gracefully
    console.error("GET /api/category error →", error);
    return catchError(error);
  }
};
