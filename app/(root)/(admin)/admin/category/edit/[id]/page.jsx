"use client";

import BreadCrumb from "@/components/Aplication/admin/BreadCrumb";
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
import useFetch from "@/hooks/useFetch";
import { showToast } from "@/lib/showToast";
import { loginSchema } from "@/lib/zodSchema";
import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
} from "@/routes/AdminPannelRoute";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_CATEGORY_SHOW, label: "Category" },
  { href: "", label: "Edit Category" },
];

const EditCategory = () => {
  const { id } = useParams();
  const { data: categoryData } = useFetch({ url: `/api/category/get/${id}` });

  const [loading, setLoading] = useState(false);
  const [isSlugEdited, setIsSlugEdited] = useState(false); // 👈 new state

  const formSchema = loginSchema.pick({ name: true, slug: true, _id: true });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      _id: id,
    },
  });

  // ✅ Populate form when data arrives
  useEffect(() => {
    if (categoryData && categoryData.success) {
      const data = categoryData?.data;
      form.reset({
        name: data?.name || "",
        slug: data?.slug || "",
        _id: data?._id || "",
      });
    }
  }, [categoryData, form]);

  // ✅ Auto-generate slug from name (unless user edited slug manually)
  const nameValue = form.watch("name");

  useEffect(() => {
    if (nameValue && !isSlugEdited) {
      form.setValue("slug", slugify(nameValue, { lower: true }));
    }
  }, [nameValue, isSlugEdited, form]);

  // ✅ Detect manual slug edit
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "slug") {
        setIsSlugEdited(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // ✅ Handle form submit
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data: response } = await axios.put(`/api/category/update`, values);
      if (!response.success) throw new Error(response.message);

      showToast({ type: "success", message: response.message });
    } catch (error) {
      showToast({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card>
        <CardHeader className="border-b">
          <h3 className="text-xl font-medium">Edit Category</h3>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-6"
            >
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Category Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug Field */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Slug"
                        {...field}
                        onChange={(e) => {
                          setIsSlugEdited(true); // 👈 mark slug as edited
                          field.onChange(e);
                        }}
                      />
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
                  {loading ? (
                    <Loader className="animate-spin mr-2" />
                  ) : (
                    "Update Category"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCategory;
