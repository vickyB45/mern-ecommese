import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { loginSchema } from "@/lib/zodSchema";
import MediaModel from "@/models/media.model";
import { isValidObjectId } from "mongoose";

export async function PUT(req){
    try{
        const auth = await isAuthenticated("admin")
        if(!auth.isAuth){
            return response(false,403,"Unauthorized.")
        }
        await connectDB()
        const  payload = await req.json()   

        const schema = loginSchema.pick({_id:true,alt:true,title:true})
         const validate = schema.safeParse(payload)
        if(!validate.success){
            return response(false,400,"invalid data",validate.error)
        }

        const { _id, alt, title } = validate.data

        if(!isValidObjectId(_id)){
            return response(false,400,"Invalid media ID.")
        }
        const getMedia = await MediaModel.findById(_id)
        if(!getMedia){
            return response(false,404,"Media not found.")
        }
        getMedia.alt = alt
        getMedia.title = title
        await getMedia.save()
        return response(true,200,"Media updated successfully.",getMedia)

    }catch(error){
        catchError(error)
    }
}