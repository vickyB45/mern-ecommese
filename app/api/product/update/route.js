import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { isAuthenticated } from "@/lib/authentication";
import slugify from "slugify";
import { loginSchema } from "@/lib/zodSchema";
import ProductModel from "@/models/product.model";
import { encode } from "entities";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated(request);
    if (!auth) return response(false, 403, "Unauthorized");

    await connectDB();

    const payload = await request.json();

    const schema = loginSchema.pick({
      _id:true,
      name: true,
      slug: true,
      category: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      description: true,
      media: true,
    });

    const validatedData = schema.safeParse(payload);
    if (!validatedData.success)
      return response(false, 422, "Invalid form data", validatedData.error);

    const productData = validatedData.data;

    const getProduct = await ProductModel.findOne({ deletedAt: null,_id: productData._id });
    if (!getProduct) return response(false, 404, "Data not found");

    // ✅ Update name and regenerate slug automatically
    getProduct.name = productData.name;
    getProduct.slug = productData.slug;
    getProduct.category = productData.category;
    getProduct.mrp = productData.mrp;
    getProduct.sellingPrice = productData.sellingPrice;
    getProduct.discountPercentage = productData.discountPercentage;
    getProduct.description = encode(productData.description);
    getProduct.media = productData.media;

    await getProduct.save(); // ✅ persist changes

    // ✅ Return updated category so frontend can update cache immediately
    return response(true, 200, "Product Updated successfully", getProduct);
  } catch (error) {
    return catchError(error);
  }
}
