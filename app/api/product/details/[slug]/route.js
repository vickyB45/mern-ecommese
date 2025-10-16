import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import MediaModel from "@/models/media.model";
import ProductModel from "@/models/product.model";
import ProductVariantModel from "@/models/product.variant";
import ReviewModel from "@/models/Review.model";
import CategoryModel from "@/models/category.model";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { slug } = await params;
    const searchParams = req.nextUrl.searchParams;

    const size = searchParams.get("size");
    const color = searchParams.get("color");

    if (!slug) return response(false, 404, "Product not found");

    // 🔹 Find Product by Slug
    const getProduct = await ProductModel.findOne({
      slug,
      deletedAt: null,
    })
      .populate("media", "secure_url")
      .populate("category", "name") // also populate category name
      .lean();

    if (!getProduct) return response(false, 404, "Product not found");

    // 🔹 Prepare Variant Filter
    const variantFilter = { product: getProduct._id };
    if (size) variantFilter.size = size;
    if (color) variantFilter.color = color;

    const variant = await ProductVariantModel.findOne(variantFilter)
      .populate("media", "secure_url")
      .lean();

    // 🔹 Get available colors & sizes
    const getColor = await ProductVariantModel.distinct("color", {
      product: getProduct._id,
    });

    const getSize = await ProductVariantModel.distinct("size", {
      product: getProduct._id,
    });

    // 🔹 Get review count
    const review = await ReviewModel.countDocuments({
      product: getProduct._id,
    });

    // 🔹 Get similar products (same category)
    let similarProducts = [];
    if (getProduct.category?._id) {
      similarProducts = await ProductModel.find({
        category: getProduct.category._id,
        deletedAt: null,
        _id: { $ne: getProduct._id }, // exclude current product
      })
        .populate("media", "secure_url")
        .sort({ createdAt: -1 }) // latest 4
        .limit(8)
        .lean();
    }

    // 🔹 Final Response
    const productData = {
      product: getProduct,
      variant: variant || null,
      colors: getColor,
      sizes: getSize.length ? getSize : [],
      reviewCount: review,
      similarProducts,
    };

    return response(true, 200, "Product Data found", productData);
  } catch (error) {
    return catchError(error);
  }
}
