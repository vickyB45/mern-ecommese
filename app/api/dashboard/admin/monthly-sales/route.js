import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import orderModel from "@/models/order.model";

export async function GET(){
    try{
          const auth = await isAuthenticated("admin");
                if (!auth) {
                  return response(false, 403, "Unauthorized");
                }
            
                await connectDB();

                const monthlySales = await orderModel.aggregate([
                   {
                     $match:{
                        deletedAt:null,
                        status:{$in:['pending','processing','shipped','delivered']}
                    }
                   }
                    ,{
                        $group:{
                            _id:{
                                year:{$year:"$createdAt"},
                                month:{$month:"$createdAt"}
                            },
                            totalSales:{$sum:"$totalAmount"}
                        }
                    },
                  {
                      $sort:{
                        "_id.year":1,
                        "_id.month":1
                    }
                  }
                ])
                return response(true,200,"Order Data Found",monthlySales )

    }catch(error){
        return catchError(error)
    }
}