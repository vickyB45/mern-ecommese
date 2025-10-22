import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunctions";
import { userModel } from "@/models/User.model";

export async function GET(){
    try {
        await connectDB();
        const auth = await isAuthenticated("user"); 
        if (!auth.isAuth) {
          return response(false, 401, "Unauthorized");
        }
    
        // ✅ Handle the buffer object: Convert to array, then to Buffer, then to hex string
        let userId;
        if (auth.userId && auth.userId.buffer) {
          // Extract values from the object into an array (e.g., [104, 227, ...])
          const bufferArray = Object.values(auth.userId.buffer);
          // Create Buffer from array and convert to hex string
          userId = Buffer.from(bufferArray).toString("hex");
        } else {
          userId = auth.userId?.toString();  // Fallback (unlikely needed)
        }
        
    
        // Get recent user
        const user = await userModel.findById( userId ).lean();
    
    
        return response(true, 200, "Profile Data",  user );
      } catch (error) {
        console.error("Backend error:", error);
        return catchError(error);
      }
}