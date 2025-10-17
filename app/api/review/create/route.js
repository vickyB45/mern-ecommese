import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { z } from "zod";
import { isAuthenticated } from "@/lib/authentication";
import ReviewModel from "@/models/Review.model";

// Dedicated review schema (matches frontend and DB)
const reviewSchema = z.object({
  product: z.string().min(3, "Product is required"),
  user: z.string().min(3, "User is required"),
  rating: z.number().min(1, "Rating is required"),
  title: z.string().min(3, "Title is required"),
  review: z.string().min(3, "Review is required"),
});

export async function POST(request) {
  try {
    const auth = await isAuthenticated("user");
    if (!auth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const payload = await request.json();
    const validatedData = reviewSchema.safeParse(payload);
    if (!validatedData.success) {
      return response(false, 422, "Invalid form data", validatedData.error);
    }

    const { product, user, rating, title, review } = validatedData.data;

    const newRating = new ReviewModel({
      product: product,
      user: user,
      rating: rating,
      title: title,
      review: review,
    });

    await newRating.save();

    return response(true, 200, "Review Submitted successfully");
  } catch (error) {
    return catchError(error);
  }
}
