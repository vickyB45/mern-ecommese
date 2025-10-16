import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import CategoryModel from "@/models/category.model";
import ProductModel from "@/models/product.model";

export async function GET(req) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;

    // 🔹 Filters
    const sizeParam = searchParams.get("size"); // single or comma-separated
    const colorParam = searchParams.get("color");
    const categoryParam = searchParams.get("category"); // comma-separated
    const minPrice = parseInt(searchParams.get("minPrice")) || 0;
    const maxPrice = parseInt(searchParams.get("maxPrice")) || 100000;
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

    // 🔹 Convert comma-separated params to array
    const sizes = sizeParam ? sizeParam.split(",") : [];
    const colors = colorParam ? colorParam.split(",") : [];
    const categorySlugs = categoryParam ? categoryParam.split(",") : [];

    // 🔹 Find category IDs from slugs
    let categoryIds = [];
    if (categorySlugs.length > 0) {
      const categories = await CategoryModel.find({
        deletedAt: null,
        slug: { $in: categorySlugs },
      })
        .select("_id")
        .lean();

      categoryIds = categories.map((c) => c._id);
    }

    // 🔹 Match stage
    const matchStage = {};
    if (categoryIds.length > 0) matchStage.category = { $in: categoryIds };
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
          from: "product_variants",
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
            sizes.length > 0
              ? { $in: ["$$variant.size", sizes] }
              : { $literal: true },
            colors.length > 0
              ? { $in: ["$$variant.color", colors] }
              : { $literal: true },
            ...(minPrice !== null ? [{ $gte: ["$$variant.sellingPrice", minPrice] }] : []),
            ...(maxPrice !== null ? [{ $lte: ["$$variant.sellingPrice", maxPrice] }] : []),
          ],
        },
      },
    },
  },
},


      // Lookup Media
      {
        $lookup: {
          from: "media",
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
