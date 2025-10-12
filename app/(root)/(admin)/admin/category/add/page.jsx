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
import { showToast } from "@/lib/showToast";
import { loginSchema } from "@/lib/zodSchema";
import {
  ADMIN_CATEGORY_ADD,
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
} from "@/routes/AdminPannelRoute";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_CATEGORY_SHOW, label: "Category" },
  { href: "", label: "Add Category" },
];

const AddCategory = () => {
  const [loading, setLoading] = useState(false);

const formSchema = loginSchema.pick({ name: true, slug: true });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const nameValue = form.watch("name");

  useEffect(() => {
    if (nameValue) {
      form.setValue("slug", slugify(nameValue, { lower: true }));
    } else {
      form.setValue("slug", "");
    }
  }, [nameValue, form]);

  const onSubmit = async (values) => {

    setLoading(true);
    try {
      const { data: response } = await axios.post(
        "/api/category/create",
        values
      );
      if (!response.success) {
        throw new Error(response.message);
      }
      form.reset();
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
          <h3 className="text-xl font-medium">Add Category</h3>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-6"
            >
              {/* Alt Field */}
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

              {/* Title Field */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter Slug" {...field} />
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
                    "Add Category"
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

export default AddCategory;
