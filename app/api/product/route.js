import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import ProductModel from "@/models/product.model";
import { NextResponse } from "next/server";

export async function GET(req) {
  console.log("COOKIE IN REQUEST:", req.cookies.get("access_token"));

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
        { slug: { $regex: globalFilter, $options: "i" } },
        { "categoryData.name": { $regex: globalFilter, $options: "i" } },
        {
          $expr:{
            $regexMatch:{
              input:{$toString:"$mrp"},
            regex:globalFilter,
            options:"i"
            }
          }
        },
        {
          $expr:{
            $regexMatch:{
              input:{$toString:"$sellingPrice"},
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
    if (['mrp','sellingPrice','discountPercentage'].includes(f.id)) {
      matchQuery[f.id] = Number(f.value);
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
      {
        $lookup: {
          from: "categories",       // <-- actual collection name
          localField: "category",   // singular
          foreignField: "_id",
          as: "categoryData"
        }
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true
        }
      },
      { $match: matchQuery },
      { $sort: sortQuery },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          category: "$categoryData.name",
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          description: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1
        }
      }
    ];

    const getProduct = await ProductModel.aggregate(aggregatePipeline);

    // Total count using same matchQuery (without skip/limit)
    const totalCountPipeline = [
      { $match: matchQuery },
      { $count: "total" }
    ];
    const totalCountAgg = await ProductModel.aggregate(totalCountPipeline);
    const totalRowCount = totalCountAgg[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: getProduct || [],
      meta: { totalRowCount }
    });

  } catch (error) {
    console.error("Error in GET /product:", error);
    return catchError(error);
  }
}