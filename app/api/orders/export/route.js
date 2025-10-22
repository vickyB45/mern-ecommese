import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { userModel } from "@/models/User.model";

export async function GET(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized.");

    await connectDB();
    const filter = {
        deletedAt: null
    }

    const getOrder = await userModel.find(filter).sort("-products").lean()

    if(!getOrder){
        return response(false, 404, "Collection Empty");
    }
    return response(true, 200, "Data found",getOrder);
    
  } catch (error) {
    return catchError(error); // ✅ must return
  }
}
