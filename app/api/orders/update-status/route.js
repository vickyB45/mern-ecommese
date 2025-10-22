import { connectDB } from "@/lib/databaseConnection";
import { isAuthenticated } from "@/lib/authentication";
import { response, catchError } from "@/lib/helperFunctions";
import orderModel from "@/models/order.model";

export async function PUT(req) {
  try {
      
      // ✅ Authenticate user
      const auth = await isAuthenticated("admin");
      
    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized");
    }
    await connectDB();
    const {_id,status} = await req.json()

    // ✅ Extract userId safely
   if(!_id || !status){
       return response(false, 400, "Order id and Status are required");

   }

    // ✅ Fetch order with nested populate
const order = await orderModel.findById(_id)



    if (!order) {
      return response(false, 404, "Order not found");
    }
    
    order.status = status;
    

await order.save()
    

    return response(true, 200, "Order Status updated successfully");
  } catch (error) {
    console.error("💥 Order fetch error:", error);
    return catchError(error);
  }
}
