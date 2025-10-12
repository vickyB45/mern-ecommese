"use client";
import BreadCrumb from "@/components/Aplication/admin/BreadCrumb";
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
import { sizeOptions, sizes } from "@/lib/utils";
import { loginSchema } from "@/lib/zodSchema";
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW, ADMIN_PRODUCT_VARIANT_ADD, ADMIN_PRODUCT_VARIANT_SHOW } from "@/routes/AdminPannelRoute";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Extend loginSchema with product-specific fields
const extendedLoginSchema = loginSchema.pick({
  product: true,
  sku: true,
  color: true,
  size: true,
  mrp: true,
  sellingPrice: true,
  discountPercentage: true,
});

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: "Product Variant" },
  { href: ADMIN_PRODUCT_VARIANT_ADD, label: "Add Product Variant" },
];

const AddProducts = () => {
  const [loading, setLoading] = useState(false);
  const [producutOption, setProducutOption] = useState([]);
  const { data: getProduct } = useFetch({
    url: "/api/product?deleteType=SD&&size=10000 ",
  });

  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  useEffect(() => {
    if (getProduct?.success) {
      const options = getProduct.data.map((product) => ({
        label: product.name,
        value: product._id,
      }));
      setProducutOption(options);
      console.log(options)
    }
  }, [getProduct]);

  const form = useForm({
    resolver: zodResolver(extendedLoginSchema),
    defaultValues: {
      product: '',
      sku: '',
      color: '',
      size: '',
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
    },
  });

  const nameValue = form.watch("name");

  //discount %
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
      const { data: response } = await axios.post(
        "/api/product-variant/create",
        values
      );

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
          <h3 className="text-xl font-medium">Add Product Variant</h3>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-6"
            >
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                {/* Category Field */}
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <FormControl>
                        <Select
                          options={producutOption}
                          selected={field.value}
                          setSelected={field.onChange}
                          inMulti={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Product SKU"
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
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter color"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Select
                          options={sizeOptions}
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
                    {selectedMedia.map((media, index) => (
                      <div key={index} className="h-24 w-24 border">
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
                      "Add Product Variant"
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