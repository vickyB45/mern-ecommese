
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
import { ADMIN_COUPON_SHOW, ADMIN_DASHBOARD, ADMIN_DASHBOARDz} from "@/routes/AdminPannelRoute";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Extend loginSchema with product-specific fields
const extendedLoginSchema = loginSchema.pick({
  _id:true,
  code:true,
  discountPercentage: true,
  minShoppingAmmount:true,
  validity:true
});

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_COUPON_SHOW, label: "Coupons" },
  { href: "", label: "Edit Coupon" },
];

const EditCoupon = () => {
   const { id } = useParams();
  const [loading, setLoading] = useState(false);
  

  const {data:getCouponData} = useFetch({url:`/api/coupon/get/${id}`})

  

  const form = useForm({
    resolver: zodResolver(extendedLoginSchema),
    defaultValues: {
      _id:id,
      code:"",
      discountPercentage: 0,
      minShoppingAmmount:0,
      validity:0
    },
  });

useEffect(() => {
  if (getCouponData && getCouponData?.success) {
    const coupon = getCouponData.data;

    // Format validity date → dd/mm/yy
    const formattedValidity = coupon.validity
      ? new Date(coupon.validity).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
      : "";

    form.reset({
      _id:coupon._id,
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      minShoppingAmmount: coupon.minShoppingAmmount,
      validity: formattedValidity,
    });
  }
}, [getCouponData]);

  


  // submit 
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      
      // numeric conversion (safety)
      values.mrp = Number(values.mrp);
      values.sellingPrice = Number(values.sellingPrice);
      values.discountPercentage = Number(values.discountPercentage);

      // attach media ids

      // API call
      const { data: response } = await axios.put("/api/coupon/update", values);

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
          <h3 className="text-xl font-medium">Edit Coupon</h3>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-6"
            >
              <div className="grid md:grid-cols-2 gap-3">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Code"
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
                          
                          type="number"
                          placeholder="Enter Discount Percentage"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* */}
                <FormField
                  className="text-black dark:text-white"
                  control={form.control}
                  name="minShoppingAmmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Shopping Amount</FormLabel>
                      <FormControl>
                        <Input
                          
                          type="number"
                          placeholder="Enter Min Shopping Amount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

             

                {/* */}
                <FormField
                  className="text-black dark:text-white"
                  control={form.control}
                  name="validity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validity</FormLabel>
                      <FormControl>
                        <Input
                          
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

             


             
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
                      "Update Coupon"
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

export default EditCoupon;
