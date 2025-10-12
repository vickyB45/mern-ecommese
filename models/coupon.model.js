import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    discountPercentage:{
        type:Number,
        required:true,
        trim:true
    },
    minShoppingAmmount:{
        type:Number,
        required:true,
    },
    validity:{
        type:Number,
        required:true,
        trim:true
    },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite errors in development
const CouponModel =
  mongoose.models.Coupon || mongoose.model("Coupon", couponSchema, "coupons");

export default CouponModel;
