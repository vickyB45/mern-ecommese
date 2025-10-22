'use client';
import UserPanelLayout from "@/components/Aplication/website/UserPanelLayout";
import WebsiteBreadcrumb from "@/components/Aplication/website/WebsiteBreadcrumb";
import useFetch from "@/hooks/useFetch";
import { WEBSITE_ORDER_DETAILS } from "@/routes/WebsiteRoute";
import Link from "next/link";
import React from "react";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { IoCartOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const breadCrumbData = {
  title: "Dashboard",
  links: [{ label: "Dashboard" }],
};

const MyAccount = () => {
  const { data: dashboardData } = useFetch({ url: "/api/dashboard/user" });
  const cartStore = useSelector((store) => store.cartStore);

  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumbData} />

      <UserPanelLayout>
        <div className="shadow rounded bg-white">
          {/* Header */}
          <div className="p-6 text-2xl font-semibold border-b">Dashboard</div>

          {/* Dashboard Cards */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Orders */}
              <div className="flex items-center justify-between gap-5 border rounded-lg p-5 shadow-sm hover:shadow-md transition">
                <div>
                  <h4 className="font-semibold text-lg mb-1">Total Orders</h4>
                  <span className="font-semibold text-gray-500 text-lg">
                    {dashboardData?.data?.totlOrder || 0}
                  </span>
                </div>
                <div className="w-16 h-16 bg-primary rounded-full flex justify-center items-center">
                  <HiOutlineShoppingBag className="text-white" size={28} />
                </div>
              </div>

              {/* Items In Cart */}
              <div className="flex items-center justify-between gap-5 border rounded-lg p-5 shadow-sm hover:shadow-md transition">
                <div>
                  <h4 className="font-semibold text-lg mb-1">Items In Cart</h4>
                  <span className="font-semibold text-gray-500 text-lg">
                    {cartStore?.count || 0}
                  </span>
                </div>
                <div className="w-16 h-16 bg-primary rounded-full flex justify-center items-center">
                  <IoCartOutline className="text-white" size={28} />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Recent Orders</h4>
              <div className="overflow-x-auto border rounded-lg shadow-sm">
                <table className="w-full min-w-[600px] table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-start p-3 text-sm font-medium text-gray-600 uppercase tracking-wider border-b">
                        Sr. No.
                      </th>
                      <th className="text-start p-3 text-sm font-medium text-gray-600 uppercase tracking-wider border-b">
                        Order ID
                      </th>
                      <th className="text-start p-3 text-sm font-medium text-gray-600 uppercase tracking-wider border-b">
                        Total Items
                      </th>
                      <th className="text-start p-3 text-sm font-medium text-gray-600 uppercase tracking-wider border-b">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.data?.resentOrder?.map((order, index) => (
                      <tr
                        key={order._id}
                        className={`transition hover:bg-gray-50 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="p-3 text-sm border-b">{index + 1}</td>
                        <td className="p-3 text-sm border-b text-primary hover:underline font-medium">
                          <Link href={WEBSITE_ORDER_DETAILS(order.orderId)}>
                            {order.orderId}
                          </Link>
                        </td>
                        <td className="p-3 text-sm border-b">{order.products?.length}</td>
                        <td className="p-3 text-sm border-b font-semibold">
                          ₹{order.totalAmount}
                        </td>
                      </tr>
                    ))}
                    {(!dashboardData?.data?.resentOrder ||
                      dashboardData?.data?.resentOrder?.length === 0) && (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-4 text-gray-500"
                        >
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </UserPanelLayout>
    </div>
  );
};

export default MyAccount;
