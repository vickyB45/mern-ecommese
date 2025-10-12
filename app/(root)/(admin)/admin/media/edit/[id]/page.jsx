"use client";

import React, { useEffect, useState } from "react";
// ✅ Custom Breadcrumb import (replace base Breadcrumb)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { z } from "zod";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AdminPannelRoute";
import Image from "next/image";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import BreadCrumb from "@/components/Aplication/admin/BreadCrumb";

// ✅ Original breadCrumbData array (back for custom component)
const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_MEDIA_SHOW, label: "Media" },
  { href: "", label: "Edit Media" }, // href empty for current page
];

// ✅ Zod Schema
const formSchema = z.object({
  _id: z.string().nonempty("_id is required"),
  alt: z.string().nonempty("Alt text is required"),
  title: z.string().nonempty("Title is required"),
});

// ✅ Log routes for debugging (remove after)
console.log("Breadcrumb Routes:", { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW });

const EditPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ Fetch media details
  const { data: mediaData } = useFetch({
    url: id ? `/api/media/get/${id}` : null,
  });

  // ✅ Setup form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: "",
      alt: "",
      title: "",
    },
  });

  // ✅ Prefill form
  useEffect(() => {
    if (mediaData?.data && mediaData.success) {
      const data = mediaData.data;
      form.reset({
        _id: data._id || "",
        alt: data.alt || "",
        title: data.title || "",
      });
    }
  }, [mediaData, form]);

  // ✅ Handle submit (same as before)
  const onSubmit = async (values) => {
    console.log("Submitting values:", values);
    try {
      setLoading(true);
      const { data: response } = await axios.put(`/api/media/update`, values);
      console.log("Full API response:", response);

      if (!response?.success) {
        const errorMsg = response?.message || "Update failed";
        showToast({ type: "error", message: errorMsg });
        return;
      }

      const successMsg = response.message || "Media updated successfully";
      showToast({ type: "success", message: successMsg });
      router.push(ADMIN_MEDIA_SHOW);

    } catch (error) {
      console.error("API Error:", error);
      const message = error?.response?.data?.message || error.message || "Something went wrong";
      showToast({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ✅ Fixed: Use custom BreadCrumb with prop */}
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card>
        <CardHeader className="border-b">
          <h3 className="text-xl font-medium">Edit Media</h3>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
              <div className="mb-4 w-[150px] sm:w-[200px]">
                {mediaData?.data?.secure_url ? (
                  <Image
                    className="rounded-md w-full h-auto object-cover"
                    src={mediaData.data.secure_url}
                    alt={mediaData.data.alt || "Uploaded media"}
                    width={250}
                    height={250}
                    priority={true}
                    unoptimized={true}
                  />
                ) : (
                  <div className="animate-pulse bg-gray-200 rounded-md w-full h-48 sm:h-56"></div>
                )}
              </div>

              {/* Alt Field */}
              <FormField
                control={form.control}
                name="alt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter Alt text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* _id Field */}
              <FormField
                control={form.control}
                name="_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>_id</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter ID" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="max-w-xs mx-auto">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer flex bg-[#8e51ff] hover:bg-[#7f39ff] text-white mt-4 transition-all duration-200 justify-center items-center"
                >
                  {loading ? <Loader className="animate-spin mr-2" /> : "Update Media"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPage;
