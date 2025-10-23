import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import MediaModel from "@/models/media.model";
import ProductModel from "@/models/product.model";
import ReviewModel from "@/models/Review.model";

export async function GET() {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

   const latestReview = await ReviewModel.find({deletedAt:null}).sort({createdAt:-1}).populate({
    path:'product',
    select:"name media",
    populate:{
        path:"media",
        select:"secure_url"
    }
   }).limit(10).lean()
    return response(true, 200, "Review found successfully", latestReview);
  } catch (error) {
    return catchError(error);
  }
}
