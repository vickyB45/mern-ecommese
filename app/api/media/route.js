import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import MediaModel from "@/models/media.model";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Not Authorized.");
    }

    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page"), 10) || 0;
    const limit = parseInt(searchParams.get("limit"), 10) || 10;
    const deleteType = searchParams.get("deleteType"); // SD, RSD, PD

    let filter = {};
    if (deleteType === "SD") {
      filter = { deletedAt: null };
    } else if (deleteType === "PD") {
      filter = { deletedAt: { $ne: null } };
    }

    // ✅ Corrected sort field (createdAt)
    const mediaData = await MediaModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .lean();

    const totalMedia = await MediaModel.countDocuments(filter);

    return NextResponse.json({
      mediaData,
      hasMore: (page + 1) * limit < totalMedia,
    });
  } catch (error) {
    catchError(error);
  }
}
