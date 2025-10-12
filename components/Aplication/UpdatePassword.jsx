"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/zodSchema";
import { z } from "zod";
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
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Loader } from "lucide-react";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";

const formSchema = loginSchema
    .pick({
        password: true,
        email: true,
    })
    .extend({
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

const UpdatePassword = ({ email }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [hidePass, setHidePass] = useState(true);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email || "",
            password: "",
            confirmPassword: "",
        },
    });

    const handlePasswordUpdate = async (values) => {
        const { confirmPassword, ...payload } = values; // exclude confirmPassword
        try {
            setLoading(true);
            const { data: passwordUpdate } = await axios.put(
                "/api/auth/reset-password/update-password",
                payload
            );

            if (!passwordUpdate.success) {
                showToast({ type: "error", message: passwordUpdate.message });
                return;
            }

            form.reset();
            showToast({ type: "success", message: passwordUpdate.message });
            router.push(WEBSITE_LOGIN);
        } catch (error) {
            const message = error?.response?.data?.message || error.message || "Something went wrong";
            showToast({ type: "error", message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen overflow-x-hidden">
            <div className="md:max-w-[450px] shadow-lg">
                <CardContent className="p-6">
                    <div className="text-center">
                        <h2 className="text-3xl py-2 font-bold heading">
                            Update Password
                        </h2>
                        <p className="text-sm text-gray-600">
                            Please enter your new password and confirm it below. Make sure
                            your password is strong and secure to protect your account. After
                            updating, use your new password to log in.
                        </p>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handlePasswordUpdate)}
                            className="space-y-4 mt-6"
                        >
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
                                                    className="pr-10 mb-4 md:mb-0"
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                onClick={() => setHidePass(!hidePass)}
                                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
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
                                                    placeholder="Confirm your password"
                                                    {...field}
                                                    className="pr-10"
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                onClick={() => setHidePass(!hidePass)}
                                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                            >
                                                {hidePass ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#8e51ff] hover:bg-[#7f39ff] text-white mt-4 transition-all duration-200 flex justify-center items-center gap-2"
                            >
                                {loading && <Loader className="animate-spin h-5 w-5" />}
                                {loading ? "Updating..." : "Update Password"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </div>
        </div>
    );
};

export default UpdatePassword;
