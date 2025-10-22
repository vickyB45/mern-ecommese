import { isAuthenticated } from "@/lib/authentication";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { userModel } from "@/models/User.model";

export async function PUT(request){
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
        const user = await userModel.findById( userId )
        if(!user){
            return response(false, 404, "User not found! " );
        }
        
        
        const formData = await request.formData()
        const image = formData.get("image")

        user.name = formData.get('name')
        user.phone = formData.get('phone')
        user.address = formData.get('address')

        if(image){
            const imageBuffer = await image.arrayBuffer()
const base64Image = `data:${image.type};base64,${Buffer.from(imageBuffer).toString('base64')}`;


            const uploadfile = await cloudinary.uploader.upload(base64Image,{
                upload_preset:process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
            })

            //remove old avatar

            if(user?.avatar?.public_id){
                await cloudinary.api.delete_resources([user.avatar.public_id])
            }

            // update new avatar 

            user.avatar = {
                url:uploadfile.secure_url,
                public_id:uploadfile.public_id
            }
        }
        
        await user.save()
      return response(true, 200, "Profile Updated Successfully", {
    _id: user._id.toString(),
    role: user.role,
    name: user.name,
    phone: user.phone,
    address: user.address,
    avatar: user.avatar
});



      } catch (error) {
        console.error("Backend error:", error);
        return catchError(error);
      }
}