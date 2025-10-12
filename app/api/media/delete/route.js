import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import MediaModel from "@/models/media.model";
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary"; // make sure this path is correct
import { isAuthenticated } from "@/lib/authentication";

// 🟢 PUT — Soft delete / Restore
export async function PUT(req) {
    console.log("PUT request received");
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Not Authorized");

    await connectDB();
    const payload = await req.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0)
      return response(false, 400, "No media ids provided");
     
    const media = await MediaModel.find({ _id: { $in: ids } }).lean();
    if (!media.length) return response(false, 404, "No media found");

    if (!["SD", "RSD"].includes(deleteType))
      return response(false, 400, "Invalid delete type");


    if (deleteType === "SD") {
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toISOString() } }
      );
      return response(true, 200, `${media.length} media moved to trash successfully`);
    } else {
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
      return response(true, 200, `${media.length} media restored successfully`);
    }
  } catch (error) {
    catchError(error);
  }
}

// 🔴 DELETE — Permanent delete
export async function DELETE(req) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Not Authorized");

    await connectDB();

     const payload = await req.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0)
      return response(false, 400, "No media ids provided");

    if (deleteType !== "PD")
      return response(false, 400, "Invalid delete type");

    const media = await MediaModel.find({ _id: { $in: ids } })
      .session(session)
      .lean();

    if (!media.length) return response(false, 404, "No media found");


    if(deleteType !== "PD"){
        await session.abortTransaction();
        session.endSession();
        return response(false, 400, "Invalid delete type");
    }

    await MediaModel.deleteMany({ _id: { $in: ids } }).session(session);
    const publicIds = media.map((m) => m.publicId);

    try{
        await cloudinary.api.delete_resources(publicIds);
    }
    catch(cloudError){
        await session.abortTransaction();
        console.error("Cloudinary deletion error:", cloudError);
    }
    await session.commitTransaction();
    session.endSession();

    return response(true, 200, `${media.length} media deleted permanently`);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return catchError(error);
  }
}

