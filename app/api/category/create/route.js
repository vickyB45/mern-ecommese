import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { z } from "zod";
import CategoryModel from "@/models/category.model";
import { isAuthenticated } from "@/lib/authentication";

const categorySchema = z.object({
  name: z.string().min(3, "Name is required"),
  slug: z.string().min(3, "Slug is required"),
});

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const payload = await request.json();
    const validatedData = categorySchema.safeParse(payload);
    if (!validatedData.success) {
      return response(false, 422, "Invalid form data", validatedData.error);
    }

    const { name, slug } = validatedData.data;

    const newCategory = new CategoryModel({
      name,
      slug,
    });

    await newCategory.save();

    return response(true, 200, "Category created successfully");
  } catch (error) {
    return catchError(error);
  }
}
