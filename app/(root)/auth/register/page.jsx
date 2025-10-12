"use client";

import React, { useState } from "react";
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
import { EyeOff, Loader } from "lucide-react";

import { IoEye, IoEyeOff } from "react-icons/io5";
import Link from "next/link";
import { WEBSITE_LOGIN, WEBSITE_REGISTER } from "@/routes/WebsiteRoute";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";


const formSchema = loginSchema.pick({
    name: true,
    email: true,
    password: true,
}).extend({
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

const RegisterPage = () => {
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [hidePass, setHidePass] = useState(true)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name:"",
            email: "",
            password: "",
            confirmPassword:""
        },
    });

  const handleRegisterSubmit = async (values) => {
  // exclude confirmPassword
  
  // API call
  // await fetch("/api/register", { method: "POST", body: JSON.stringify(payload) });
  try{
    setLoading(true)
    const {data:registerResponse} = await axios.post("/api/auth/register",values)
    if(!registerResponse.success){
showToast({ type: "error", message: registerResponse.message })
    }
    form.reset()
showToast({ type: "success", message: registerResponse.message })
router.push(WEBSITE_LOGIN)

  }catch(error){
    showToast({ type: "error", message: error.message })
  }
  finally{
    setLoading(false)
  }

};

    return (
        <div className="flex justify-center items-center min-h-screen  overflow-x-hidden">
            <Card className=" md:max-w-[450px] shadow-lg">
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
                        <h2 className="text-3xl py-2 font-bold heading">
                            Create Your Account
                        </h2>
                        <p className="text-sm text-gray-600">
                            Sign up to start shopping, track orders, and manage your account.
                        </p>

                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleRegisterSubmit)}
                            className="space-y-4 mt-6"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fullname</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter your Fullname"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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

                           <div className="md:flex gap-4 ">
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
                                                    className="pr-10 mb-4 md:mb-0" // space for eye icon
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                onClick={() => setHidePass(!hidePass)}
                                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer "
                                            >
                                                {hidePass ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type={hidePass ? "password" : "text"}
                                                    placeholder="Enter your confirm password"
                                                    {...field}
                                                    className="pr-10" // space for eye icon
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                onClick={() => setHidePass(!hidePass)}
                                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer "
                                            >
                                                {hidePass ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                           </div>



                            <Button
                                type="submit"
                                disabled={loading}
                                className={`w-full  bg-[#8e51ff] cursor-pointer hover:bg-[#7f39ff] text-white mt-4 transition-all duration-200`}
                            >
                                {loading ? <Loader className="animate-spin" /> : "Register"}
                            </Button>
                        </form>
                        <div className="text-sm mt-2 flex justify-center gap-1 items-center">
                            <p>Already have an Account? </p>
                            <Link href={WEBSITE_LOGIN} className=" hover:underline text-[#7f39ff]">Login</Link>
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default RegisterPage