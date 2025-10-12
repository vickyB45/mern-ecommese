import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import MediaModel from "@/models/media.model";
import { isAuthenticated } from "@/lib/authentication";

export async function POST(req) {
  const payload = await req.json();

   try {
    // Auth check
    const auth = await isAuthenticated(req, "admin");
    if (!auth.isAuth) {
      return response(false, 403, "Not ");
    }

    // Payload check
    if (!payload || !Array.isArray(payload) || payload.length === 0) {
      return response(false, 400, "No media payload provided");
    }

    await connectDB();

    const insertedMedia = [];

    for (const item of payload) {
      try {
        const media = await MediaModel.create(item);
        insertedMedia.push(media);
      } catch (err) {
        console.error("Failed to insert:", item, err);
        // Delete from Cloudinary if insert fails
        if (item.public_id) {
          try {
            await cloudinary.api.delete_resources([item.public_id]);
          } catch (deleteErr) {
            console.error("Failed to delete from Cloudinary:", item.public_id, deleteErr);
          }
        }
      }
    }

    return response(true, 201, `${insertedMedia.length} media uploaded successfully`, insertedMedia);

  } catch (error) {
    // Delete uploaded files from Cloudinary if DB fails
    if (payload && payload.length > 0) {
      const publicIds = payload.filter(f => f?.public_id).map(f => f.public_id);
      if (publicIds.length > 0) {
        try {
          await cloudinary.api.delete_resources(publicIds);
        } catch (deleteError) {
          error.cloudinaryError = deleteError;
        }
      }
    }

    // Return error response
    return catchError(error);
  }
}
