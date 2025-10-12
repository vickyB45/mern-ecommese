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

    const getCostomers = await userModel.find(filter).sort({createdAt:-1}).lean()

    if(!getCostomers){
        return response(false, 404, "Collection Empty");
    }
    return response(true, 200, "Data found",getCostomers);
    
  } catch (error) {
    return catchError(error); // ✅ must return
  }
}
