import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import CategoryModel from "@/models/category.model";
import ProductModel from "@/models/product.model";

export async function GET(req) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;

    // 🔹 Filters
    const size = searchParams.get("size");
    const color = searchParams.get("color");
    const categorySlug = searchParams.get("category");
    const minPrice = parseInt(searchParams.get("minPrice")) || null;
    const maxPrice = parseInt(searchParams.get("maxPrice")) || null;
    const search = searchParams.get("q");

    // 🔹 Pagination
    const limit = parseInt(searchParams.get("limit")) || 12;
    const page = parseInt(searchParams.get("page")) || 0;
    const skip = page * limit;

    // 🔹 Sorting
    const sortOption = searchParams.get("sort") || "default_sorting";
    const sortQuery =
      {
        default_sorting: { createdAt: -1 },
        asc: { name: 1 },
        desc: { name: -1 },
        price_low_high: { sellingPrice: 1 },
        price_high_low: { sellingPrice: -1 },
      }[sortOption] || { createdAt: -1 };

    // 🔹 Find category ID from slug
    let categoryId = null;
    if (categorySlug) {
      const categoryData = await CategoryModel.findOne({
        deletedAt: null,
        slug: categorySlug,
      })
        .select("_id")
        .lean();

      if (categoryData) categoryId = categoryData._id;
    }

    // 🔹 Match stage
    const matchStage = {};
    if (categoryId) matchStage.category = categoryId;
    if (search) matchStage.name = { $regex: search, $options: "i" };

    // 🔹 Aggregation Pipeline
    const products = await ProductModel.aggregate([
      { $match: matchStage },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: limit + 1 },

      // Lookup Variants
      {
        $lookup: {
          from: "product_variants", // ⚠️ Check your actual collection name
          localField: "_id",
          foreignField: "product",
          as: "variants",
        },
      },

      // Filter Variants
      {
        $addFields: {
          variants: {
            $filter: {
              input: "$variants",
              as: "variant",
              cond: {
                $and: [
                  size ? { $eq: ["$$variant.size", size] } : { $literal: true },
                  color
                    ? { $eq: ["$$variant.color", color] }
                    : { $literal: true },
                  ...(minPrice !== null
                    ? [{ $gte: ["$$variant.sellingPrice", minPrice] }]
                    : []),
                  ...(maxPrice !== null
                    ? [{ $lte: ["$$variant.sellingPrice", maxPrice] }]
                    : []),
                ],
              },
            },
          },
        },
      },

      // Lookup Media
      {
        $lookup: {
          from: "media", // ⚠️ Change to "medias" if that's your collection
          localField: "media",
          foreignField: "_id",
          as: "media",
        },
      },

      // Lookup Category
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Project fields
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          category: { _id: 1, name: 1, slug: 1 },
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          media: {
            _id: 1,
            secure_url: 1,
            alt: 1,
          },
          variants: {
            color: 1,
            size: 1,
            mrp: 1,
            sellingPrice: 1,
            discountPercentage: 1,
          },
        },
      },
    ]);

    // 🔹 Pagination logic
    let nextPage = null;
    if (products.length > limit) {
      nextPage = page + 1;
      products.pop();
    }

    // 🔹 Return response
    return response(true, 200, "Product data found", {
      products,
      nextPage,
    });
  } catch (error) {
    return catchError(error);
  }
}
