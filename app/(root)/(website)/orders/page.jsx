'use client'

import React from 'react';
import UserPanelLayout from '@/components/Aplication/website/UserPanelLayout';
import WebsiteBreadcrumb from '@/components/Aplication/website/WebsiteBreadcrumb';
import useFetch from '@/hooks/useFetch';
import Link from 'next/link';
import { WEBSITE_ORDER_DETAILS } from '@/routes/WebsiteRoute';

const breadCrumbData = {
  title: "Orders",
  links: [{ label: "Orders" }],
};

const OrderPage = () => {
  const { data: ordersData, loading } = useFetch({ url: "/api/user-order" });

  if (loading) return <div className="p-5">Loading...</div>;

  const orders = ordersData?.data?.orders || [];

  return (
    <div className="">
      <WebsiteBreadcrumb props={breadCrumbData} />

      <UserPanelLayout>
        <div className="shadow rounded bg-white">
          {/* Header */}
          <div className="p-5 text-xl font-semibold border-b">Orders</div>

          {/* Orders Table */}
          <div className="mt-5">
            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="w-full min-w-[700px] table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-start p-3 text-sm font-medium text-gray-600 uppercase tracking-wider border-b">Sr.No.</th>
                    <th className="text-start p-3 text-sm font-medium text-gray-600 uppercase tracking-wider border-b">Order ID</th>
                    <th className="text-start p-3 text-sm font-medium text-gray-600 uppercase tracking-wider border-b">Total Items</th>
                    <th className="text-start p-3 text-sm font-medium text-gray-600 uppercase tracking-wider border-b">Amount</th>
                    <th className="text-start p-3 text-sm font-medium text-gray-600 uppercase tracking-wider border-b">Status</th>
                    <th className="text-start p-3 text-sm font-medium text-gray-600 uppercase tracking-wider border-b">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <tr
                        key={order._id}
                        className={`hover:bg-gray-50 transition ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="p-3 text-sm border-b">{index + 1}</td>
                        <td className="p-3 text-sm border-b text-blue-600 hover:underline">
                          <Link href={WEBSITE_ORDER_DETAILS(order.orderId)}>
                            {order.orderId}
                          </Link>
                        </td>
                        <td className="p-3 text-sm border-b">
                          {order.products?.reduce((total, item) => total + item.quantity, 0)}
                        </td>
                        <td className="p-3 text-sm border-b font-semibold">₹{order.totalAmount}</td>
                        <td className="p-3 text-sm border-b capitalize">{order.status}</td>
                        <td className="p-3 text-sm border-b">
                          {new Date(order.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-5 text-center text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </UserPanelLayout>
    </div>
  );
};

export default OrderPage;
