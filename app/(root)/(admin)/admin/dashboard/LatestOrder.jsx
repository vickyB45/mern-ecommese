"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useFetch from "@/hooks/useFetch";
import { statusBadge } from "@/lib/helperFunctions";
import Link from "next/link";
import { ADMIN_ORDER_DETAILS } from "@/routes/AdminPannelRoute";

const LatestOrder = () => {
  const [latestOrder, setLatestOrder] = useState([]);
  const { data, loading } = useFetch({
    url: "/api/dashboard/admin/latest-order",
  });

  useEffect(() => {
    if (data && data.success) {
      setLatestOrder(data.data);
    }
  }, [data]);

  // ✅ Loading Skeleton
  if (loading) {
    return (
      <div className="w-full overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
        <Table className="min-w-full table-auto">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="w-[120px] px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                Order Id
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                Payment Id
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                Total Items
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                Status
              </TableHead>
              <TableHead className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="animate-pulse">
                <TableCell className="px-4 py-2">
                  <div className="h-4 w-20 rounded bg-gray-300 dark:bg-gray-600"></div>
                </TableCell>
                <TableCell className="px-4 py-2">
                  <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-600"></div>
                </TableCell>
                <TableCell className="px-4 py-2">
                  <div className="h-4 w-12 rounded bg-gray-300 dark:bg-gray-600"></div>
                </TableCell>
                <TableCell className="px-4 py-2">
                  <div className="h-4 w-16 rounded bg-gray-300 dark:bg-gray-600"></div>
                </TableCell>
                <TableCell className="px-4 py-2 text-right">
                  <div className="h-4 w-20 rounded bg-gray-300 dark:bg-gray-600 mx-auto"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // ✅ Empty state
  if (!latestOrder || latestOrder.length === 0) {
    return (
      <div className="h-[200px] w-full flex justify-center items-center text-muted-foreground dark:text-gray-400">
        No Orders Found!
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
      <Table className="min-w-full table-auto">
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800">
            <TableHead className="w-[120px] px-4 py-2 text-left text-gray-700 dark:text-gray-300">
              Order Id
            </TableHead>
            <TableHead className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
              Payment Id
            </TableHead>
            <TableHead className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
              Total Items
            </TableHead>
            <TableHead className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
              Status
            </TableHead>
            <TableHead className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {latestOrder.map((order) => (
            <TableRow
              key={order._id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <TableCell className="px-4 py-2 font-medium text-gray-800 dark:text-gray-100">
                <Link href={ADMIN_ORDER_DETAILS(order?.orderId)}>
                  {order?.orderId}
                </Link>
              </TableCell>
              <TableCell className="px-4 py-2 text-gray-800 dark:text-gray-100">
                {order?.paymentId}
              </TableCell>
              <TableCell className="px-4 py-2 text-gray-800 dark:text-gray-100">
                {order?.products?.length}
              </TableCell>
              <TableCell className="px-4 py-2">
                {statusBadge(order?.status)}
              </TableCell>
              <TableCell className="px-4 py-2 text-right text-gray-800 dark:text-gray-100">
                ₹{order?.totalAmount?.toLocaleString("en-IN")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LatestOrder;
