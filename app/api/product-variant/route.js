import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import ProductVariantModel from "@/models/product.variant";
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
        { color: { $regex: globalFilter, $options: "i" } },
        { size: { $regex: globalFilter, $options: "i" } },
        { sku: { $regex: globalFilter, $options: "i" } },
        { "productData.name": { $regex: globalFilter, $options: "i" } },
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
    } else if(f.id === "products"){
       matchQuery["productData.name"] = { $regex: f.value, $options: "i" }
    }
    else {
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
          from: "products",       // <-- actual collection name
          localField: "product",   // singular
          foreignField: "_id",
          as: "productData"
        }
      },
      {
        $unwind: {
          path: "$productData",
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
          product: "$productData.name",
          color: 1,
          size:1,
          sku:1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1
        }
      }
    ];

    const getProductVarian = await ProductVariantModel.aggregate(aggregatePipeline);

    // Total count using same matchQuery (without skip/limit)
    const totalCountPipeline = [
      { $match: matchQuery },
      { $count: "total" }
    ];
    const totalCountAgg = await ProductVariantModel.aggregate(totalCountPipeline);
    const totalRowCount = totalCountAgg[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: getProductVarian || [],
      meta: { totalRowCount }
    });

  } catch (error) {
    console.error("Error in GET /product:", error);
    return catchError(error);
  }
}