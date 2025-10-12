"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { showToast } from "@/lib/showToast";
import { loginSchema } from "@/lib/zodSchema";
import axios from "axios";
import { Loader } from "lucide-react";

const otpVerificationSchema = loginSchema.pick({
  email: true,
  otp: true
});

const OTPVerification = ({ email, onSubmit, loading }) => {

  const [isResendOTP, setIsResendOTP] = useState(false);
  const form = useForm({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      email: email || "",
      otp: "",
    },
  });

  const otpRef = useRef([]);

  // Handle typing, auto focus next input
  const handleOtpChange = (e, index, field) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const otpArray = field.value.split("").slice(0, 6);
    otpArray[index] = value.slice(-1);

    const newOtp = otpArray.join("").padEnd(6, "");
    field.onChange(newOtp);

    if (value && index < 5) {
      otpRef.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index, field) => {
    if (e.key === "Backspace" && !field.value[index] && index > 0) {
      otpRef.current[index - 1].focus();
    }
  };

  const handleFormSubmit = (values) => {
    onSubmit(values);
  };

  // Resend OTP
  const resendOTP = async () => {
    try {
      setIsResendOTP(true);
      const { data: resendOtpResponse } = await axios.post("/api/auth/resend-otp", { email });

      if (!resendOtpResponse.success) {
        showToast({ type: "error", message: resendOtpResponse.message });
      } else {
        showToast({ type: "success", message: resendOtpResponse.message });
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      showToast({ type: "error", message });
    } finally {
      setIsResendOTP(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="md:w-[400px] shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-center mb-4">OTP Verification</h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Enter the 6-digit OTP sent to your email <span className="font-medium">{email}</span>
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">

              {/* OTP Input */}
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-between gap-2">
                        {Array.from({ length: 6 }).map((_, idx) => (
                          <Input
                            key={idx}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={field.value[idx] || ""}
                            onChange={(e) => handleOtpChange(e, idx, field)}
                            onKeyDown={(e) => handleOtpKeyDown(e, idx, field)}
                            ref={(el) => (otpRef.current[idx] = el)}
                            className="w-12 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f39ff]"
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hidden email field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Verify OTP button with loader */}
              <Button
                type="submit"
                className="w-full bg-[#7f39ff] cursor-pointer hover:bg-[#8e51ff] text-white flex justify-center items-center gap-2"
                disabled={loading}
              >
                {loading && <Loader className="animate-spin h-5 w-5" />}
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>

              {/* Resend OTP button */}
              <div className="text-center">
                <button
                  disabled={isResendOTP}
                  onClick={resendOTP}
                  type="button"
                  className={`text-[#8e51ff] text-sm hover:underline ${isResendOTP ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                >
                  {isResendOTP ? "Resending..." : "Resend OTP"}
                </button>
              </div>

            </form>
          </Form>
        </CardContent>
      </div>
    </div>
  );
};

export default OTPVerification;
