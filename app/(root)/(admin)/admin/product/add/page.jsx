



"use client";
import BreadCrumb from "@/components/Aplication/admin/BreadCrumb";
import Editor from "@/components/Aplication/admin/Editor";
import MediaModel from "@/components/Aplication/admin/MediaModel";
import Select from "@/components/Aplication/Select";
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
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from "@/routes/AdminPannelRoute";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";

// Extend loginSchema with product-specific fields
const extendedLoginSchema = loginSchema.pick({
  name: true,
  slug: true,
  category: true,
  mrp: true,
  sellingPrice: true,
  discountPercentage: true,
  description: true,
});

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_SHOW, label: "Product" },
  { href: "", label: "Add Product" },
];

const AddProducts = () => {
  const [loading, setLoading] = useState(false);
  const [categoryOption, setCategoryOption] = useState([]);
  const { data: getCategory } = useFetch({
    url: "/api/category?deleteType=SD&&size=10000",
  });

  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  useEffect(() => {
    if (getCategory?.success) {
      const options = getCategory.data.map((cat) => ({
        label: cat.name,
        value: cat._id,
      }));
      setCategoryOption(options);
    }
  }, [getCategory]);

  const form = useForm({
    resolver: zodResolver(extendedLoginSchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
      description: "",
    },
  });

  const nameValue = form.watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (nameValue) {
      form.setValue("slug", slugify(nameValue, { lower: true }));
    } else {
      form.setValue("slug", "");
    }
  }, [nameValue, form]);

  const editor = (event, editor) => {
    const data = editor.getData();
    form.setValue("description", data);
  };

  //discount %
  useEffect(() => {
    const mrp = form.getValues('mrp') || 0
    const sellingPrice = form.getValues('sellingPrice') || 0

    if (mrp > 0 && sellingPrice > 0) {
      const discountPercentage = ((mrp - sellingPrice) / mrp) * 100
      form.setValue("discountPercentage", parseFloat(discountPercentage.toFixed(2)))
    }
  }, [form.watch("mrp"), form.watch("sellingPrice")])

  // submit 
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      if (selectedMedia.length <= 0) {
        showToast({ type: "error", message: "Please select Media" });
        setLoading(false);
        return;
      }

      // numeric conversion (safety)
      values.mrp = Number(values.mrp);
      values.sellingPrice = Number(values.sellingPrice);
      values.discountPercentage = Number(values.discountPercentage);

      // attach media ids
      values.media = selectedMedia.map((media) => media._id);

      // API call
      const { data: response } = await axios.post("/api/product/create", values);

      if (!response.success) throw new Error(response.message);

      form.reset();
      setSelectedMedia([]);
      showToast({ type: "success", message: response.message });
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card>
        <CardHeader className="border-b">
          <h3 className="text-xl font-medium">Add Product</h3>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-6"
            >
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
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
                          placeholder="Enter Product Name"
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category Field */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          options={categoryOption}
                          selected={field.value}
                          setSelected={field.onChange}
                          inMulti={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* MRP Field */}
                <FormField
                  control={form.control}
                  name="mrp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MRP</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter MRP"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Selling Price */}
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter Selling Price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Discount Percentage */}
                <FormField
                  className="text-black dark:text-white"
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Percentage</FormLabel>
                      <FormControl>
                        <Input
                          readOnly
                          type="number"
                          placeholder="Enter Discount Percentage"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description - Updated for responsiveness */}
                <div className="md:col-span-2">
                  <FormLabel className="mb-2">Description</FormLabel>
                  <Editor onChange={editor} />
                  <FormMessage />
                </div>

                {/* Media Selector - Updated for responsiveness */}
                  <MediaModel
                    open={open}
                    setOpen={setOpen}
                    selectedMedia={selectedMedia}
                    setSelectedMedia={setSelectedMedia}
                    isMultiple={true}
                  />
                  

                {/* Selected Media Preview - Updated for responsiveness */}
                {selectedMedia.length > 0 && (
                  <div className="col-span-1 md:col-span-2 flex justify-center items-center gap-2 flex-wrap">
                    {selectedMedia.map((media) => (
                      <div key={media._id} className="h-24 w-24 border">
                        <Image
                          className="size-full object-cover"
                          src={media.url}
                          height={100}
                          width={100}
                          alt=""
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Select Media Button - Updated for responsiveness */}
                <div
                  onClick={() => setOpen(true)}
                  className="col-span-1 md:col-span-2 bg-gray-50 dark:bg-card border w-full max-w-[200px] cursor-pointer mx-auto p-4 text-center"
                >
                  <span className="font-semibold">Select Media</span>
                </div>

                {/* Submit Button - Updated for responsiveness */}
                <div className="col-span-1 md:col-span-2 max-w-xs mx-auto">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer flex bg-[#8e51ff] hover:bg-[#7f39ff] text-white mt-4 transition-all duration-200 justify-center items-center"
                  >
                    {loading ? (
                      <Loader className="animate-spin mr-2" />
                    ) : (
                      "Add Product"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProducts;
