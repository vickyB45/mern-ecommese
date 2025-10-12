import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";

import { isAuthenticated } from "@/lib/authentication";
import ProductModel from "@/models/product.model";
import { loginSchema } from "@/lib/zodSchema";
import { encode } from "entities";


export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const payload = await request.json();

    const schema = loginSchema.pick({
      name:true,
      slug:true,
      category: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      description: true,
      media:true
    });



    const validatedData = schema.safeParse(payload);
    if (!validatedData.success) {
      return response(false, 422, "Invalid form data", validatedData.error);
    }

    const productData = validatedData.data

    const newProduct = new ProductModel({
      name : productData.name,
      slug : productData.slug,
      category : productData.category,
      mrp : productData.mrp,
      sellingPrice:productData.sellingPrice,
      discountPercentage : productData.discountPercentage,
      description :encode( productData.description),
      media: productData.media

    });

    await newProduct.save();

    return response(true, 200, "newProduct created successfully");
  } catch (error) {
    return catchError(error);
  }
}
