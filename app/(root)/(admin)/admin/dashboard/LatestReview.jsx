'use client'
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { IoStar } from "react-icons/io5";
import useFetch from "@/hooks/useFetch";

const LatestReview = () => {
  const [latestReview, setLatestReview] = useState([]);
  const { data, loading } = useFetch({
    url: "/api/dashboard/admin/latest-reviews",
  });

  useEffect(() => {
    if (data && data.success) {
      setLatestReview(data.data);
    }
  }, [data]);

  // ✅ Loading Skeleton
  if (loading) {
    return (
      <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
        <Table className="min-w-full table-auto">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                Review
              </TableHead>
              <TableHead className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                Rating
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="animate-pulse">
                <TableCell className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                    <div className="h-4 w-32 rounded bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div
                        key={j}
                        className="h-4 w-4 rounded bg-gray-300 dark:bg-gray-600"
                      ></div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // ✅ Empty state
  if (!latestReview || latestReview.length === 0) {
    return (
      <div className="h-[200px] w-full flex justify-center items-center text-muted-foreground dark:text-gray-400">
        No Review Found!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
      <Table className="min-w-full table-auto">
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800">
            <TableHead className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
              Review
            </TableHead>
            <TableHead className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
              Rating
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {latestReview.map((review) => (
            <TableRow
              key={review._id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {/* ✅ Avatar + Review title */}
              <TableCell className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        review.product?.media?.[0]?.secure_url ||
                        "/assets/images/img-placeholder.webp"
                      }
                    />
                  </Avatar>
                  <span className="font-medium text-sm text-gray-800 dark:text-gray-100">
                    {review.title || "No Title"}
                  </span>
                </div>
              </TableCell>

              {/* ✅ Rating */}
              <TableCell className="px-4 py-2 text-right">
                <div className="flex justify-end gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <IoStar
                      key={j}
                      className={
                        j < review.rating
                          ? "text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }
                    />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LatestReview;
