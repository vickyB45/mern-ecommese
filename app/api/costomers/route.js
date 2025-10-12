import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { userModel } from "@/models/User.model";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Authentication check
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    // Connect DB
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const start = parseInt(searchParams.get("start") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);

    // Parse filters and sorting
    let filters = [];
    try {
      filters = JSON.parse(searchParams.get("filters") || "[]");
    } catch (e) {}

    const globalFilter = searchParams.get("globleFilter") || ""; // optional: rename to globalFilter
    let sorting = [];
    try {
      sorting = JSON.parse(searchParams.get("sorting") || "[]");
    } catch (e) {}

    const deleteType = searchParams.get("deleteType") || "SD";

    // Build matchQuery
    let matchQuery = deleteType === "SD" ? { deletedAt: null } : { deletedAt: { $ne: null } };

    if (globalFilter.trim()) {
      matchQuery["$or"] = [
        { name: { $regex: globalFilter, $options: "i" } },
        { email: { $regex: globalFilter, $options: "i" } },
        { phone: { $regex: globalFilter, $options: "i" } },
        { address: { $regex: globalFilter, $options: "i" } },
        ...(isBool
      ? [{ isEmailVerified: globalFilter.toLowerCase() === "true" }]
      : []),
        
      ];
    }
    
    if (Array.isArray(filters) && filters.length > 0) {
  const textFilters = [];

  filters.forEach(f => {
    textFilters.push({ [f.id]: { $regex: f.value, $options: "i" } });
  });

  if (textFilters.length > 0) {
    matchQuery.$and = textFilters;
  }
}

    // Sorting
    let sortQuery = {};
    if (Array.isArray(sorting) && sorting.length > 0) {
      sorting.forEach(sort => {
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
          email: 1,
          phone:1,
          address:1,
          avatar:1,
          isEmailVerified:1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1
        }
      }
    ];

    const getCostomers = await userModel.aggregate(aggregatePipeline);

    // Total count using same matchQuery (without skip/limit)
    const totalCountPipeline = [
      { $match: matchQuery },
      { $count: "total" }
    ];
    const totalCountAgg = await userModel.aggregate(totalCountPipeline);
    const totalRowCount = totalCountAgg[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: getCostomers || [],
      meta: { totalRowCount }
    });

  } catch (error) {
    console.error("Error in GET /product:", error);
    return catchError(error);
  }
}