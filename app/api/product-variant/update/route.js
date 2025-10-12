import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { isAuthenticated } from "@/lib/authentication";
import slugify from "slugify";
import { loginSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/models/product.variant";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated(request);
    if (!auth) return response(false, 403, "Unauthorized");

    await connectDB();

    const payload = await request.json();

   const schema = loginSchema.pick({
    _id:true,
  product:true,
  size:true,
  color:true,
  sku:true,
  mrp: true,
  sellingPrice: true,
  discountPercentage: true,
  media:true
});

    const validatedData = schema.safeParse(payload);
    if (!validatedData.success)
      return response(false, 422, "Invalid form data", validatedData.error);

    const productData = validatedData.data;

    const getProductVariant = await ProductVariantModel.findOne({ deletedAt: null,_id: productData._id });
    if (!getProductVariant) return response(false, 404, "Data not found");

    // ✅ Update name and regenerate slug automatically
    
    getProductVariant.product = productData.product;
    getProductVariant.color = productData.color;
    getProductVariant.size = productData.size;
    getProductVariant.sku = productData.sku;
    getProductVariant.mrp = productData.mrp;
    getProductVariant.sellingPrice = productData.sellingPrice;
    getProductVariant.discountPercentage = productData.discountPercentage;
    getProductVariant.media = productData.media;

    await getProductVariant.save(); // ✅ persist changes

    // ✅ Return updated category so frontend can update cache immediately
    return response(true, 200, "Product Variant Updated successfully", getProductVariant);
  } catch (error) {
    return catchError(error);
  }
}
