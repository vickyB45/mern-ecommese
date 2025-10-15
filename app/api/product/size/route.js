import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import ProductVariantModel from "@/models/product.variant";

export const GET = async () => {
  try {
    // ✅ Connect to database
    await connectDB();

    // ✅ Aggregate unique sizes in sorted order
    const sizesData = await ProductVariantModel.aggregate([
      { $match: { deletedAt: null } }, // skip deleted items (optional but good)
      { $sort: { _id: 1 } },
      {
        $group: {
          _id: "$size",
          first: { $first: "$_id" },
        },
      },
      { $sort: { first: 1 } },
      { $project: { _id: 0, size: "$_id" } },
    ]);

    // ✅ Handle empty results
    if (!sizesData?.length) {
      return response(false, 404, "No sizes found");
    }

    // ✅ Extract only size values
    const sizes = sizesData.map((item) => item.size);

    // ✅ Return success response
    return response(true, 200, "Sizes fetched successfully", sizes);

  } catch (error) {
    console.error("GET /api/product-variant/sizes →", error);
    return catchError(error);
  }
};
