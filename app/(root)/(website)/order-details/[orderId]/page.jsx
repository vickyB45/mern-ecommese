"use client";

import React, { useEffect, useState } from "react";
import WebsiteBreadcrumb from "@/components/Aplication/website/WebsiteBreadcrumb";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import Link from "next/link";
import Image from "next/image";

const OrderDetailsPage = ({ params }) => {
  const { orderId } = React.use(params);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const breadCrumb = {
    title: "Order Details",
    links: [{ label: "Shop", href: WEBSITE_SHOP }, { label: "Order Details" }],
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/get/${orderId}`
        );
        const data = await res.json();
        if (!data.success) {
          setError(data.message || "Order not found");
        } else {
          setOrderData(data.data);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Something went wrong while fetching the order.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12 animate-pulse">
        <div className="max-w-6xl mx-auto px-4 mt-10 space-y-10">
          {/* Breadcrumb Placeholder */}
          <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>

          {/* Product Table Skeleton */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <div className="h-6 w-48 bg-gray-200 rounded"></div>

            {/* Table header */}
            <div className="grid grid-cols-7 gap-4 border-t border-b py-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>

            {/* 3 product rows */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-7 gap-4 items-center border-b py-3"
              >
                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                <div className="col-span-2 h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          {/* Summary + Shipping side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Summary Skeleton */}
            <div className="bg-white md:p-6 rounded-xl shadow-md space-y-3">
              <div className="h-6 w-40 bg-gray-200 rounded mb-3"></div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>

            {/* Billing Skeleton */}
            <div className="bg-white p-6 rounded-xl shadow-md space-y-3">
              <div className="h-6 w-56 bg-gray-200 rounded mb-3"></div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <WebsiteBreadcrumb props={breadCrumb} />
        <h2 className="text-2xl font-semibold mt-4">{error}</h2>
        <Link href={WEBSITE_SHOP}>
          <button className="mt-6 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
            Go to Shop
          </button>
        </Link>
      </div>
    );
  }

  const order = orderData;
  const subtotal = order.subTotal;
  const discount = order.discount;
  const couponDiscount = order.couponDiscount;
  const totalPayable = order.totalAmount;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <WebsiteBreadcrumb props={breadCrumb} />

      <div className="max-w-6xl mx-auto md:px-4 mt-10 space-y-10">
        {/* 🛒 Product Details Table */}
        <div className="bg-white md:p-6 rounded-xl shadow-md overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Products Details</h2>
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left border">Image</th>
                <th className="py-3 px-4 text-left border">Product Name</th>
                <th className="py-3 px-4 text-left border">Color</th>
                <th className="py-3 px-4 text-left border">Size</th>
                <th className="py-3 px-4 text-center border">Qty</th>
                <th className="py-3 px-4 text-center border">Price</th>
                <th className="py-3 px-4 text-center border">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border">
                    <div className="relative w-16 h-16">
                      {item.media?.[0] ? (
                        <Image
                          src={item.media[0]}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="bg-gray-200 w-16 h-16 rounded" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 border font-medium">{item.name}</td>
                  <td className="py-3 px-4 border">{item.color || "-"}</td>
                  <td className="py-3 px-4 border">{item.size || "-"}</td>
                  <td className="py-3 px-4 border text-center">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 border text-center">
                    ₹{item.sellingPrice}
                  </td>
                  <td className="py-3 px-4 border text-center font-semibold">
                    ₹{(item.sellingPrice * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 💰 Summary + 📦 Shipping side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <table className="w-full border text-sm">
              <tbody>
                <tr>
                  <td className="py-2 px-4 border font-medium">Subtotal</td>
                  <td className="py-2 px-4 border text-right">₹{subtotal}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border font-medium text-green-700">
                    Discount
                  </td>
                  <td className="py-2 px-4 border text-right text-green-700">
                    - ₹{discount}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border font-medium">
                    Coupon Discount
                  </td>
                  <td className="py-2 px-4 border text-right text-green-700">
                    - ₹{couponDiscount}
                  </td>
                </tr>
                <tr className="bg-gray-100 font-semibold text-base">
                  <td className="py-3 px-4 border">Total Payable</td>
                  <td className="py-3 px-4 border text-right">
                    ₹{totalPayable}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Billing / Shipping */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Billing & Shipping Details
            </h2>
            <table className="w-full border text-sm">
              <tbody>
                <tr>
                  <td className="py-2 px-4 border font-medium w-1/3">Name</td>
                  <td className="py-2 px-4 border">{order.name}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border font-medium">Email</td>
                  <td className="py-2 px-4 border">{order.email}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border font-medium">Phone</td>
                  <td className="py-2 px-4 border">{order.phone}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border font-medium">Country</td>
                  <td className="py-2 px-4 border uppercase">
                    {order.country}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border font-medium">State</td>
                  <td className="py-2 px-4 border capitalize">{order.state}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border font-medium">City</td>
                  <td className="py-2 px-4 border capitalize">{order.city}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border font-medium">Address</td>
                  <td className="py-2 px-4 border">
                    {order.address} - {order.pincode}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border font-medium">Order ID</td>
                  <td className="py-2 px-4 border">{order.orderId}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border font-medium">Payment ID</td>
                  <td className="py-2 px-4 border">{order.paymentId}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border font-medium">Status</td>
                  <td
                    className={`py-2 px-4 border font-semibold ${
                      order.status === "pending"
                        ? "text-yellow-600"
                        : order.status === "paid"
                        ? "text-green-600"
                        : order.status === "cancelled"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {order.status.toUpperCase()}
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
