import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import orderModel from "@/models/order.model";
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
    let matchQuery =
      deleteType === "SD" ? { deletedAt: null } : { deletedAt: { $ne: null } };

    if (globalFilter.trim()) {
      matchQuery["$or"] = [
        { orderId: { $regex: globalFilter, $options: "i" } },
        { paymentId: { $regex: globalFilter, $options: "i" } },
        { name: { $regex: globalFilter, $options: "i" } },
        { email: { $regex: globalFilter, $options: "i" } },
        { phone: { $regex: globalFilter, $options: "i" } },
        { country: { $regex: globalFilter, $options: "i" } },
        { state: { $regex: globalFilter, $options: "i" } },
        { city: { $regex: globalFilter, $options: "i" } },
        { pincode: { $regex: globalFilter, $options: "i" } },
        { subTotal: { $regex: globalFilter, $options: "i" } },
        { subTotal: { $regex: globalFilter, $options: "i" } },
        { discount: { $regex: globalFilter, $options: "i" } },
        { couponDiscount: { $regex: globalFilter, $options: "i" } },
        { status: { $regex: globalFilter, $options: "i" } },
      ];
    }

    if (Array.isArray(filters) && filters.length > 0) {
      textFilters.push({ [f.id]: { $regex: f.value, $options: "i" } });
    }

    // Sorting
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
    ];

    const getOrders = await orderModel.aggregate(aggregatePipeline);

    // Total count using same matchQuery (without skip/limit)
    const totalCountPipeline = [{ $match: matchQuery }, { $count: "total" }];
    const totalCountAgg = await orderModel.aggregate(totalCountPipeline);
    const totalRowCount = totalCountAgg[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: getOrders || [],
      meta: { totalRowCount },
    });
  } catch (error) {
    console.error("Error in GET /product:", error);
    return catchError(error);
  }
}
