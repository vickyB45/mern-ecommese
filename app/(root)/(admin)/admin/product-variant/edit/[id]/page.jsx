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
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";

// ✅ Extend loginSchema with product-specific fields
const extendedLoginSchema = loginSchema.pick({
  _id:true,
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
  { href: "", label: "Edit Product" },
];

const EditPage = () => {
  const { id } = useParams();

  // ✅ Fetch product & category
  const { data: getProduct, loading: getProductLoading } = useFetch({
    url: `/api/product/get/${id}`,
  });

  const { data: getCategory } = useFetch({
    url: "/api/category?deleteType=SD&&size=10000",
  });

  const [loading, setLoading] = useState(false);
  const [categoryOption, setCategoryOption] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  // ✅ Set category options
  useEffect(() => {
    if (getCategory?.success) {
      const options = getCategory.data.map((cat) => ({
        label: cat.name,
        value: cat._id,
      }));
      setCategoryOption(options);
    }
  }, [getCategory]);

  // ✅ React Hook Form setup
  const form = useForm({
    resolver: zodResolver(extendedLoginSchema),
    defaultValues: {
      _id:id,
      name: "",
      slug: "",
      category: "",
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
      description: "",
    },
  });

  // ✅ Fill form when product loaded
  useEffect(() => {
    if (getProduct?.success) {
      const product = getProduct.data;
      form.reset({
        _id:product?._id,
        name: product?.name,
        slug: product?.slug,
        category: product?.category,
        mrp: product?.mrp,
        sellingPrice: product?.sellingPrice,
        discountPercentage: product?.discountPercentage,
        description: product?.description,
      });

      if (product.media) {
        const media = product.media.map((m) => ({
          id: m._id, // 👈 changed to "id"
          url: m.secure_url,
        }));
        setSelectedMedia(media);
      }
    }
  }, [getProduct, form]);

  // ✅ Slug auto-generate from name
  const nameValue = form.watch("name");
  useEffect(() => {
    if (nameValue) {
      form.setValue("slug", slugify(nameValue, { lower: true }));
    } else {
      form.setValue("slug", "");
    }
  }, [nameValue, form]);

  // ✅ Auto calculate discount
  useEffect(() => {
    const mrp = form.getValues("mrp") || 0;
    const sellingPrice = form.getValues("sellingPrice") || 0;

    if (mrp > 0 && sellingPrice > 0) {
      const discountPercentage = ((mrp - sellingPrice) / mrp) * 100;
      form.setValue(
        "discountPercentage",
        parseFloat(discountPercentage.toFixed(2))
      );
    }
  }, [form.watch("mrp"), form.watch("sellingPrice")]);

  // ✅ Submit handler


  const onSubmit = async (values) => {
    setLoading(true);
    try {
      if (selectedMedia.length <= 0) {
        showToast({ type: "error", message: "Please select Media" });
        setLoading(false);
        return;
      }

      values.mrp = Number(values.mrp);
      values.sellingPrice = Number(values.sellingPrice);
      values.discountPercentage = Number(values.discountPercentage);
      values.media = selectedMedia.map((media) => media.id); // 👈 fixed

      const { data: response } = await axios.put(
        "/api/product/update",
        values
      );

      if (!response.success) throw new Error(response.message);

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
          <h3 className="text-xl font-medium">Edit Product</h3>
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
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Percentage</FormLabel>
                      <FormControl>
                        <Input
                          readOnly
                          type="number"
                          placeholder="Auto Calculated"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
              {/* Description */}
<div className="col-span-2 ">
  <FormLabel>Description</FormLabel>
  <div className="w-full overflow-hidden">
    {!getProductLoading && (
      <Editor
        onChange={(event, editor) =>
          form.setValue("description", editor.getData())
        }
        initialData={form.getValues("description")}
      />
    )}
  </div>
  <FormMessage />
</div>


               
                  <MediaModel
                    open={open}
                    setOpen={setOpen}
                    selectedMedia={selectedMedia}
                    setSelectedMedia={setSelectedMedia}
                    isMultiple={true}
                  />

                {/* ✅ Selected Media Preview */}
                <div className="col-span-2 flex flex-col gap-2">
                  {selectedMedia.length > 0 && (
                  <div className="col-span-1 md:col-span-2 flex justify-center items-center gap-2 flex-wrap">
                    {selectedMedia.map((media) => (
                      <div key={media.id} className="h-24 w-24 border">
                        <Image
                          className="size-full object-cover"
                          src={media.url}
                          height={100}
                          width={100}
                          alt="Product media"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Select Media Button */}
                <div
                  onClick={() => setOpen(true)}
                  className="col-span-1 md:col-span-2 bg-gray-50 dark:bg-card border w-full max-w-[200px] cursor-pointer mx-auto p-4 text-center"
                >
                  <span className="font-semibold">Select Media</span>
                </div>
                </div>

                {/* Submit Button */}
                <div className="col-span-2 max-w-xs mx-auto">
                  <Button
                    type="submit"
                    disabled={loading}
                    className= "col-span-2 w-full flex bg-[#8e51ff] hover:bg-[#7f39ff] text-white mt-4 justify-center items-center"
                  >
                    {loading ? (
                      <Loader className="animate-spin mr-2" />
                    ) : (
                      "Update Product"
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

export default EditPage;
