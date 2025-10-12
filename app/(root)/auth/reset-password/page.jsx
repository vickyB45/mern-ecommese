"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import { showToast } from "@/lib/showToast";
import OTPVerification from "@/components/Aplication/OTPVerification";
import UpdatePassword from "@/components/Aplication/UpdatePassword";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otpEmail, setOtpEmail] = useState(null);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [emailVerificationLoading, setEmailVerificationLoading] = useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);

  // ✅ Handle sending OTP to email
  const handleEmailVerification = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setEmailVerificationLoading(true);
      const { data: sendOtpResponse } = await axios.post("/api/auth/reset-password/send-otp", { email });

      if (!sendOtpResponse.success) {
        showToast({ type: "error", message: sendOtpResponse.message });
        return;
      }

      setOtpEmail(email);
      showToast({ type: "success", message: sendOtpResponse.message });
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      showToast({ type: "error", message });
    } finally {
      setEmailVerificationLoading(false);
    }
  };

  // ✅ Handle OTP submission
  const handleOtpSubmit = async (values) => {
    try {
      setOtpVerificationLoading(true);
      const { data: otpResponse } = await axios.post("/api/auth/reset-password/verify-otp", values);

      if (!otpResponse.success) {
        showToast({ type: "error", message: otpResponse.message });
        return;
      }

      showToast({ type: "success", message: otpResponse.message });
      setIsOtpVerified(true);
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      showToast({ type: "error", message });
    } finally {
      setOtpVerificationLoading(false);
    }
  };

  return (
    <div className="max-w-[400px] mx-auto mt-16 p-4 shadow-lg">
      {!otpEmail ? (
        <CardContent className="text-center">
          <form onSubmit={handleEmailVerification} className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
            <p className="text-sm text-gray-500">
              Enter your registered email below to receive a reset OTP.
            </p>

            <Input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={emailVerificationLoading}
            />

            <Button
              type="submit"
              disabled={emailVerificationLoading}
              className="w-full mb-3"
            >
              {emailVerificationLoading ? `Sending...` : "Send OTP"}
            </Button>
          </form>

          <Link href={WEBSITE_LOGIN} className="text-[#7e38ff] text-sm hover:underline">
            Back To Login
          </Link>
        </CardContent>
      ) : !isOtpVerified ? (
        <OTPVerification
          email={otpEmail}
          onSubmit={handleOtpSubmit}
          loading={otpVerificationLoading}
        />
      ) : (
        <UpdatePassword email={otpEmail} /> // ✅ Pass email to update password
      )}
    </div>
  );
};

export default ResetPassword;
