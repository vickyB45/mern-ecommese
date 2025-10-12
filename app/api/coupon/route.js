import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import CouponModel from "@/models/coupon.model";
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
        { code: { $regex: globalFilter, $options: "i" } },
       
        {
          $expr:{
            $regexMatch:{
              input:{$toString:"$minShoppingAmmount"},
            regex:globalFilter,
            options:"i"
            }
          }
        },
        {
          $expr:{
            $regexMatch:{
              input:{$toString:"$discountPercentage"},
            regex:globalFilter,
            options:"i"
            }
          }
        },
      ];
    }
    
    if (Array.isArray(filters) && filters.length > 0) {
  const textFilters = [];

  filters.forEach(f => {
    if (['minShoppingAmmount','discountPercentage'].includes(f.id)) {
      matchQuery[f.id] = Number(f.value);
    }
    else if(f.id === "validity"){
        matchQuery[f.id] = new Date(f.validity)
    } else {
      textFilters.push({ [f.id]: { $regex: f.value, $options: "i" } });
    }
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
          code: 1,
          discountPercentage: 1,
          minShoppingAmmount: 1,
          validity: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1
        }
      }
    ];

    const getCoupon = await CouponModel.aggregate(aggregatePipeline);

    // Total count using same matchQuery (without skip/limit)
    const totalCountPipeline = [
      { $match: matchQuery },
      { $count: "total" }
    ];
    const totalCountAgg = await CouponModel.aggregate(totalCountPipeline);
    const totalRowCount = totalCountAgg[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: getCoupon || [],
      meta: { totalRowCount }
    });

  } catch (error) {
    console.error("Error in GET /product:", error);
    return catchError(error);
  }
}