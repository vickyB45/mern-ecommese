import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";

import { isAuthenticated } from "@/lib/authentication";
import { loginSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/models/product.variant";


export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const payload = await request.json();

    const schema = loginSchema.pick({
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
    if (!validatedData.success) {
      return response(false, 422, "Invalid form data", validatedData.error);
    }

    const varientData = validatedData.data

    const newProductVariant = new ProductVariantModel({
      product:varientData.product,
      color:varientData.color,
      size:varientData.size,
      sku:varientData.sku,
      mrp : varientData.mrp,
      sellingPrice:varientData.sellingPrice,
      discountPercentage : varientData.discountPercentage,
      media: varientData.media

    });

    await newProductVariant.save();

    return response(true, 200, "New Product Variant created successfully");
  } catch (error) {
    console.log(error.message)
    return catchError(error);
  }
}
