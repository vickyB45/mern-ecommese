import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { z } from "zod";
import CategoryModel from "@/models/category.model";
import { isAuthenticated } from "@/lib/authentication";
import slugify from "slugify";

const categorySchema = z.object({
  name: z.string().min(3, "Name is required"),
  _id: z.string().min(3, "_id is required"),
});

export async function PUT(request) {
  try {
    const auth = await isAuthenticated(request);
    if (!auth) return response(false, 403, "Unauthorized");

    await connectDB();

    const payload = await request.json();
    const validatedData = categorySchema.safeParse(payload);
    if (!validatedData.success)
      return response(false, 422, "Invalid form data", validatedData.error);

    const { _id, name } = validatedData.data;

    const getCategory = await CategoryModel.findOne({ deletedAt: null, _id });
    if (!getCategory) return response(false, 404, "Data not found");

    // ✅ Update name and regenerate slug automatically
    getCategory.name = name;
    getCategory.slug = slugify(name, { lower: true });

    await getCategory.save(); // ✅ persist changes

    // ✅ Return updated category so frontend can update cache immediately
    return response(true, 200, "Category Updated successfully", getCategory);
  } catch (error) {
    return catchError(error);
  }
}
