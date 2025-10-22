"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/zodSchema";
import { z } from "zod";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Link from "next/link";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import OTPInput from "@/components/Aplication/OTPVerification";
import { USER_DASHBOARD, WEBSITE_REGISTER, WEBSITE_RESETPASSWORD } from "@/routes/WebsiteRoute";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import { useRouter, useSearchParams } from "next/navigation";
import { ADMIN_DASHBOARD } from "@/routes/AdminPannelRoute";


// ✅ schema for login
const formSchema = loginSchema
  .pick({ email: true })
  .extend({
    password: z.string().min(3, { message: "Password field is required" }),
  });


const LoginPage = () => {


const dispatch = useDispatch()
const router = useRouter()
const searchParams = useSearchParams()

  const [loading, setLoading] = useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [hidePass, setHidePass] = useState(true);
  const [otpEmail, setOtpEmail] = useState("");

  // 🧠 react-hook-form setup
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 💾 Restore OTP state if user refreshes
  useEffect(() => {
    const savedEmail = sessionStorage.getItem("otpEmail");
    if (savedEmail) setOtpEmail(savedEmail);
  }, []);

  useEffect(() => {
    if (otpEmail) {
      sessionStorage.setItem("otpEmail", otpEmail);
    } else {
      sessionStorage.removeItem("otpEmail");
    }
  }, [otpEmail]);


  // 🔐 Handle login submit
  const handleLoginSubmit = async (values) => {
    try {
      setLoading(true);
      const { data: loginResponse } = await axios.post("/api/auth/login", values);

      if (!loginResponse.success) {
        showToast({ type: "error", message: loginResponse.message });
        return;
      }

      form.reset();
      showToast({ type: "success", message: loginResponse.message });
      setOtpEmail(values.email); // switch to OTP step
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      showToast({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };


  // 🔢 Handle OTP verification submit
  const handleOtpSubmit = async (values) => {
    try {
      setOtpVerificationLoading(true);
      const { data: otpResponse } = await axios.post("/api/auth/verify-otp", values);
    
      if (!otpResponse.success) {
        showToast({ type: "error", message: otpResponse.message });
        return;
      }

      showToast({ type: "success", message: otpResponse.message });
      setOtpEmail(""); // clear OTP UI
      sessionStorage.removeItem("otpEmail");
      dispatch(login(otpResponse.data))

      if(searchParams.has("callback")){
        router.push(searchParams.get("callback"))
      }
      else{
        otpResponse.data.role === "admin" ? router.push(ADMIN_DASHBOARD) : router.push(USER_DASHBOARD)
      }

    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      showToast({ type: "error", message });
    } finally {
      setOtpVerificationLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen ">
      {otpEmail ? (
        <OTPInput
          email={otpEmail}
          loading={otpVerificationLoading}
          onSubmit={handleOtpSubmit}
        />
      ) : (
        <Card className="md:w-[370px] shadow-lg mx-2">
          <CardContent className="p-6">
            <div className="flex justify-center">
              <Image
                src="/assets/images/logo-black.png"
                alt="Logo"
                width={200}
                height={200}
                className="max-w-[130px]"
              />
            </div>

            <div className="text-center">
              <h2 className="text-3xl py-2 font-bold">Login Into Account</h2>
              <p className="text-sm text-gray-600">
                Log in to view your orders, wishlist, and account details.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleLoginSubmit)}
                className="space-y-4 mt-6"
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={hidePass ? "password" : "text"}
                            placeholder="Enter your password"
                            {...field}
                            className="pr-10"
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setHidePass(!hidePass)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {hidePass ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8e51ff] hover:bg-[#7f39ff] text-white mt-4 transition-all duration-200 flex justify-center items-center"
                >
                  {loading ? <Loader className="animate-spin mr-2" /> : "Login"}
                </Button>
              </form>

              <div className="text-sm mt-3 flex justify-center gap-1 items-center">
                <p>Don’t have an account?</p>
                <Link href={WEBSITE_REGISTER} className="hover:underline text-[#7f39ff]">
                  Create Account
                </Link>
              </div>

              <div className="text-center mt-3">
                <Link href={WEBSITE_RESETPASSWORD}
                  className="text-sm hover:underline text-[#7f39ff]"
                >
                  Forgot Password?
                </Link>
              </div>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LoginPage;
