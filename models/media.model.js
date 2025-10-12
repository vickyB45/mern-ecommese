import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
{
asset_id: { type: String, required: true, trim: true },
public_id: { type: String, required: true, trim: true },
secure_url: { type: String, required: true, trim: true }, // ✅ added to match frontend payload
path: { type: String, required: true, trim: true },
thumbnail_url: { type: String, required: true, trim: true }, // ✅ spelling kept same as frontend
alt: { type: String, trim: true },
title: { type: String, trim: true },
deletedAt: { type: Date, default: null, index: true },
},
{ timestamps: true }
);

// ✅ Prevent model overwrite errors in development
const MediaModel =
mongoose.models.Media || mongoose.model("Media", mediaSchema, "media");

export default MediaModel;
