import mongoose from "mongoose"

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  expiredAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 min
  }
}, { timestamps: true })

// Auto delete after expiration
otpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 })

// ✅ Memory me save karne ka fix
const OTPModel = mongoose.models.OTP || mongoose.model("OTP", otpSchema, "otps")

export default OTPModel
