"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import useFetch from "@/hooks/useFetch";
import { ADMIN_DASHBOARD, ADMIN_ORDER_SHOW } from "@/routes/AdminPannelRoute";
import BreadCrumb from "@/components/Aplication/admin/BreadCrumb";
import Select from "@/components/Aplication/Select";
import { showToast } from "@/lib/showToast";
import axios from "axios";

const OrderDetailsPage = ({ params }) => {
  const { orderId } = React.use(params); 
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [updatingStatus,setUpdatingStatus] = useState(false)

  const { data } = useFetch({ url: `/api/orders/get/${orderId}` });

  useEffect(() => {
    if (data) {
      if (data.success) {
        setOrderData(data?.data);
        setOrderStatus(data?.data?.status);
        setLoading(false);
      } else {
        setError(data.message || "Something went wrong");
        setLoading(false);
      }
    }
  }, [data]);

  const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_ORDER_SHOW, label: "Orders" },
    { href: "#", label: "Order Details" },
  ];

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Unverified", value: "unverified" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const handleUpdateStatus = async ()=>{
    setUpdatingStatus(true)
try{
  const {data:response} = await axios.put("/api/orders/update-status",{
    _id:orderData?._id,
    status:orderStatus
  })
  if(!response.success){
    throw new Error(response.message)
  }

  showToast({type:"success",message:response.message})
}catch(error){
  showToast({type:'error',message:error.message})
}
finally{
setUpdatingStatus(false)
}
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 pb-12 animate-pulse text-gray-800 dark:text-gray-100">
        <div className="max-w-6xl mx-auto px-4 mt-10 space-y-10">
          <div className="h-6 w-40 bg-gray-200 dark:bg-zinc-700 rounded mb-6"></div>
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md space-y-4">
            <div className="h-6 w-48 bg-gray-200 dark:bg-zinc-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex flex-col items-center justify-center p-6 text-gray-800 dark:text-gray-100">
        <h2 className="text-2xl font-semibold text-zinc-400 mt-4">{error}</h2>
      </div>
    );
  }

  if (!orderData) return null;

  const order = orderData;
  const { subTotal, discount, couponDiscount, totalAmount: totalPayable } = order;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 pb-12 text-gray-800 dark:text-gray-100">
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <div className="max-w-6xl mx-auto md:px-4 mt-10 space-y-10">

        {/* Products Table */}
        <div className="bg-white dark:bg-zinc-800 md:p-6 rounded-xl shadow-md overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Products Details</h2>
          <table className="min-w-full border border-gray-200 dark:border-zinc-700 text-sm">
            <thead className="bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-200">
              <tr>
                {["Image", "Product Name", "Color", "Size", "Qty", "Price", "Total"].map((h) => (
                  <th key={h} className="py-3 px-4 text-left border dark:border-zinc-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {order.products.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                  <td className="py-3 px-4 border dark:border-zinc-700">
                    <div className="relative w-16 h-16">
                      {item.media?.[0] ? (
                        <Image
                          src={item.media[0]}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="bg-gray-200 dark:bg-zinc-600 w-16 h-16 rounded" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 border dark:border-zinc-700 font-medium">{item.name}</td>
                  <td className="py-3 px-4 border dark:border-zinc-700">{item.color || "-"}</td>
                  <td className="py-3 px-4 border dark:border-zinc-700">{item.size || "-"}</td>
                  <td className="py-3 px-4 border dark:border-zinc-700 text-center">{item.quantity}</td>
                  <td className="py-3 px-4 border dark:border-zinc-700 text-center">₹{item.sellingPrice}</td>
                  <td className="py-3 px-4 border dark:border-zinc-700 text-center font-semibold">
                    ₹{(item.sellingPrice * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary + Billing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Order Summary */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div>
              <table className="w-full border border-gray-200 dark:border-zinc-700 text-sm">
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border dark:border-zinc-700 font-medium">Subtotal</td>
                    <td className="py-2 px-4 border dark:border-zinc-700 text-right">₹{subTotal}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border dark:border-zinc-700 font-medium text-green-700 dark:text-green-400">Discount</td>
                    <td className="py-2 px-4 border dark:border-zinc-700 text-right text-green-700 dark:text-green-400">- ₹{discount}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border dark:border-zinc-700 font-medium">Coupon Discount</td>
                    <td className="py-2 px-4 border dark:border-zinc-700 text-right text-green-700 dark:text-green-400">- ₹{couponDiscount}</td>
                  </tr>
                  <tr className="bg-gray-100 dark:bg-zinc-700 font-semibold text-base">
                    <td className="py-3 px-4 border dark:border-zinc-700">Total Payable</td>
                    <td className="py-3 px-4 border dark:border-zinc-700 text-right">₹{totalPayable}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <hr />

            {/* Order Status */}
            <div className="pt-12">
              <h4 className="text-lg font-bold mb-3">Order Status</h4>
              <Select
                options={statusOptions}
                selected={orderStatus} // current status
                setSelected={(value) => setOrderStatus(value)}
                placeholder="Select"
                isMulti={false}
              />

              <button
              disabled={updatingStatus}

                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg transition-colors duration-300"
                onClick={() => handleUpdateStatus()}
              >
                {!updatingStatus ? "Save Status" :"Saving"}
              </button>
            </div>
          </div>

          {/* Billing & Shipping */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Billing & Shipping Details</h2>
            <table className="w-full border border-gray-200 dark:border-zinc-700 text-sm">
              <tbody>
                {[
                  ["Name", order.name],
                  ["Email", order.email],
                  ["Phone", order.phone],
                  ["Country", order.country?.toUpperCase()],
                  ["State", order.state],
                  ["City", order.city],
                  ["Address", `${order.address} - ${order.pincode}`],
                  ["Order ID", order.orderId],
                  ["Payment ID", order.paymentId],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td className="py-2 px-4 border dark:border-zinc-700 font-medium w-1/3">{label}</td>
                    <td className="py-2 px-4 border dark:border-zinc-700">{value}</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-2 px-4 border dark:border-zinc-700 font-medium">Status</td>
                  <td className={`py-2 px-4 border dark:border-zinc-700 font-semibold ${
                    orderStatus === "pending" ? "text-yellow-600 dark:text-yellow-400" :
                    orderStatus === "unverified" ? "text-gray-500 dark:text-gray-400" :
                    orderStatus === "processing" ? "text-blue-600 dark:text-blue-400" :
                    orderStatus === "shipped" ? "text-purple-600 dark:text-purple-400" :
                    orderStatus === "delivered" ? "text-green-600 dark:text-green-400" :
                    orderStatus === "cancelled" ? "text-red-600 dark:text-red-400" : ""
                  }`}>
                    {orderStatus?.toUpperCase()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
