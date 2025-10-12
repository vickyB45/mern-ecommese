import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import CategoryModel from "@/models/category.model";
import ProductModel from "@/models/product.model";
import { userModel } from "@/models/User.model";

export async function GET(){
     try {
        const auth = await isAuthenticated("admin");
        if (!auth) {
          return response(false, 403, "Unauthorized");
        }
    
        await connectDB();

        const [category,product,costomer] = await Promise.all([
            CategoryModel.countDocuments({deletedAt:null}),
            ProductModel.countDocuments({deletedAt:null}),
            userModel.countDocuments({deletedAt:null})
        ])
        return response(true,200, "Dashboard count.", {
            category,product,costomer
        })

     }
     catch(error){
        return catchError(error)
     }
}