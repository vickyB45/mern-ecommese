import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import CategoryModel from "@/models/category.model";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
      const auth = await isAuthenticated("admin");
      if (!auth.isAuth) {
          return response(false, 403, "Unauthorized.");
        }
          await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const start = parseInt(searchParams.get("start") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);

    let filters = [];
    try {
      filters = JSON.parse(searchParams.get("filters") || "[]");
    } catch (e) {
     ;
    }

    const globleFilter = searchParams.get("globleFilter") || "";
    let sorting = [];
    try {
      sorting = JSON.parse(searchParams.get("sorting") || "[]");
    } catch (e) {
     ;
    }

    const deleteType = searchParams.get("deleteType") || "SD";

    // Build matchQuery
    let matchQuery = deleteType === "SD" ? { deletedAt: null } : { deletedAt: { $ne: null } };

    if (globleFilter.trim()) {
      matchQuery["$or"] = [
        { name: { $regex: globleFilter, $options: "i" } },
        { slug: { $regex: globleFilter, $options: "i" } },
      ];
    }

    if (Array.isArray(filters) && filters.length > 0) {
      matchQuery.$and = filters.map(f => ({ [f.id]: { $regex: f.value, $options: "i" } }));
    }

    let sortQuery = {};
    if (Array.isArray(sorting) && sorting.length > 0) {
      sorting.forEach((sort) => {
        sortQuery[sort.id] = sort.desc ? -1 : 1;
      });
    } else {
      sortQuery = { createdAt: -1 };
    }

    // Aggregation pipeline
    const aggregatePipeline = [
      { $match: matchQuery },
      { $sort: sortQuery },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    const categories = await CategoryModel.aggregate(aggregatePipeline);
    const totalRowCount = await CategoryModel.countDocuments(matchQuery);


    return NextResponse.json({
      success:true,
      data: categories || [],
      meta: { totalRowCount: totalRowCount || 0 },
    });
  } catch (error) {
    console.error("Error in GET /category:", error);
    return catchError(error);
  }
}
