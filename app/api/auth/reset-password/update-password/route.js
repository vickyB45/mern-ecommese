import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { loginSchema } from "@/lib/zodSchema";
import { userModel } from "@/models/User.model";

export async function PUT(req) {
    try {
        await connectDB()
        const payload = await req.json()
        const validationSchema = loginSchema.pick({
            email: true,
            password: true
        })

        const validatedData = validationSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 401, "Invalid or missing input field", validatedData.error)
        }
        
        const {email,password} = validatedData.data
        
        const getUser = await userModel.findOne({deletedAt:null,email}).select("+password")
        if(!getUser){
            return response(false, 401, "User not found!")
            
        }
        
        getUser.password = password
        await getUser.save()
        return response(true, 200, "Password Update Succefully.")
        

    } catch (error) {
        catchError(error)
    }
}