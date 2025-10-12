  import mongoose from "mongoose";
  import { lowercase } from "zod";

  const categorySchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      deletedAt: {
        type: Date,
        default: null,
        index: true,
      },
    },
    { timestamps: true }
  );

  // Auto delete after expiration
  categorySchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

  // ✅ Memory me save karne ka fix
  const CategoryModel =
    mongoose.models.Category ||
    mongoose.model("Category", categorySchema, "categories");

  export default CategoryModel;
