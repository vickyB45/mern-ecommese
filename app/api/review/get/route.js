import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import ReviewModel from "@/models/Review.model";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectDB();
    const searchParams = req.nextUrl.searchParams;
    const productId = searchParams.get("productId");
    const page = parseInt(searchParams.get("page") || "0", 10);
    const limit = 10;
    const skip = page * limit;

    if (!productId) {
      return response(false, 400, "productId is required");
    }

    let matchQuery = {
      deletedAt: null,
      product: new mongoose.Types.ObjectId(productId),
    };

    // aggregation: match -> sort -> skip -> limit -> lookup -> project
    const aggregation = [
      { $match: matchQuery },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit + 1 },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          reviewedBy: "$userData.name",
          avatar: "$userData.avatar",
          rating: 1,
          title: 1,
          review: 1,
          createdAt: 1,
        },
      },
    ];

    const reviews = await ReviewModel.aggregate(aggregation);

    // check if more data avalable

    let nextPage = null

    if(reviews.length > limit){
        nextPage = page + 1
        reviews.pop()
    }

    return response(true, 200, "Review data",{reviews , nextPage});
  } catch (error) {
    return catchError(error);
  }
}
