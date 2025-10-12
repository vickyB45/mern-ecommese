

import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    product:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Product',
      required:true
    },
    color: {
      type:String,
      required: true,
      trim: true,
    },
    size: {
      type:String,
      required: true,
      trim: true,
    },
   mrp: {
         type: Number,
         required: true,
       },
       sellingPrice: {
         type: Number,
         required: true,
       },
       discountPercentage:{
         type:Number,
         required:true
       },
      sku:{
        type:String,
        required:true,
        unique:true
      },
       media: [
            {
              type:mongoose.Schema.Types.ObjectId,
              ref:"Media",
              required:true
            }
          ],
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

// Auto delete after expiration

// ✅ Memory me save karne ka fix
const ProductVariantModel =
  mongoose.models.ProductVariant ||  // ✅ Sahi spelling
  mongoose.model("ProductVariant", productVariantSchema, "productvariants");


export default ProductVariantModel;
