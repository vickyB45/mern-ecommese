import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { isAuthenticated } from "@/lib/authentication";
import CategoryModel from "@/models/category.model";

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
      return response(false, 400, "No category ids provided");

    const category = await CategoryModel.find({ _id: { $in: ids } }).lean();
    if (!category.length) return response(false, 404, "No category found");

    if (!["SD", "RSD"].includes(deleteType))
      return response(false, 400, "Invalid delete type");

    if (deleteType === "SD") {
      await CategoryModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toISOString() } }
      );
      return response(true, 200, `${category.length} category moved to trash successfully`);
    } else {
      await CategoryModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
      return response(true, 200, `${category.length} category restored successfully`);
    }
  } catch (error) {
    return catchError(error);
  }
}

// 🔴 DELETE — Permanent delete
export async function DELETE(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Not Authorized");

    await connectDB();
    const payload = await req.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0)
      return response(false, 400, "No category ids provided");

    if (deleteType !== "PD")
      return response(false, 400, "Invalid delete type");

    const category = await CategoryModel.find({ _id: { $in: ids } }).lean();
    if (!category.length) return response(false, 404, "No category found");

    await CategoryModel.deleteMany({ _id: { $in: ids } });
    return response(true, 200, `${category.length} category deleted permanently`);

  } catch (error) {
    return catchError(error);
  }
}
