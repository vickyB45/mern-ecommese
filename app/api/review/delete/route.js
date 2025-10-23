import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { isAuthenticated } from "@/lib/authentication";
import ReviewModel from "@/models/Review.model";

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
      return response(false, 400, "No data ids provided");

    const data = await ReviewModel.find({ _id: { $in: ids } }).lean();
    if (!data.length) return response(false, 404, "No data found");

    if (!["SD", "RSD"].includes(deleteType))
      return response(false, 400, "Invalid delete type");

    if (deleteType === "SD") {
      await ReviewModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toISOString() } }
      );
      return response(true, 200, `${data.length} data moved to trash successfully`);
    } else {
      await ReviewModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
      return response(true, 200, `${data.length} data restored successfully`);
    }
  } catch (error) {
    return catchError(error);
  }
}

//  DELETE — Permanent delete
export async function DELETE(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Not Authorized");

    await connectDB();
    const payload = await req.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0)
      return response(false, 400, "No data ids provided");

    if (deleteType !== "PD")
      return response(false, 400, "Invalid delete type");

    const data = await ReviewModel.find({ _id: { $in: ids } }).lean();
    if (!data.length) return response(false, 404, "No data found");

    await ReviewModel.deleteMany({ _id: { $in: ids } });
    return response(true, 200, `${data.length} data deleted permanently`);

  } catch (error) {
    return catchError(error);
  }
}
