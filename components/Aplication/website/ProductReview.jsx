"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IoStar } from "react-icons/io5";
import React, { useEffect, useState, useMemo } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useSelector } from "react-redux";
import { Rating } from "@mui/material";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

const ProductReview = ({ productId }) => {
  const auth = useSelector((store) => store.authStore.auth);
  const [loading, setLoading] = useState(false);
  const [writeReview, setWriteReview] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [showAll, setShowAll] = useState(false); // 👈 add this state at top of component

  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Schema
  const reviewSchema = z.object({
    product: z.string().min(1, "Product is required"),
    user: z.string().min(1, "User is required"),
    rating: z.number().min(1, "Rating is required"),
    title: z.string().min(3, "Title is required"),
    review: z.string().min(3, "Review is required"),
  });

  const form = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      product: productId,
      user: auth?._id,
      rating: 0,
      title: "",
      review: "",
    },
  });

  useEffect(() => {
    form.setValue("user", auth?._id);
  }, [auth]);

  const handleReviewSubmit = async (values) => {
    if (!auth?._id) {
      showToast({ message: "Please login to submit a review.", type: "error" });
      return;
    }
    if (!values.rating || values.rating < 1) {
      showToast({ message: "Please select a rating.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const { data: response } = await axios.post("/api/review/create", {
        ...values,
        product: productId, // Ensure we're sending the correct productId
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      form.reset();
      setWriteReview(false); // Close the form after successful submission
      showToast({ type: "success", message: response.message });
      // Refresh the reviews list by invalidating the query so it refetches
      try {
        await queryClient.invalidateQueries(["product-review", productId]);
      } catch (err) {
        console.error("Error invalidating review query:", err);
      }
    } catch (error) {
      showToast({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews
  const fetchReview = async ({ pageParam = 0 }) => {
    try {
      const { data: getReviewData } = await axios.get(
        `/api/review/get?productId=${productId}&page=${pageParam}`
      );
      if (!getReviewData.success) {
        throw new Error(getReviewData.message || "Failed to fetch reviews");
      }
      return getReviewData.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  };

  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["product-review", productId],
      queryFn: fetchReview,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
      enabled: !!productId,
    });

  const allReviews = data?.pages?.flatMap((page) => page?.reviews || []) || [];

  // ================================
  // 📊 Calculate Ratings Summary
  // ================================
  // Calculate review summary using useMemo instead of useState + useEffect
  const summary = useMemo(() => {
    if (!Array.isArray(allReviews) || allReviews.length === 0) {
      return {
        average: 0,
        totalRatings: 0,
        totalReviews: 0,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let total = 0;
    let validRatings = 0;

    allReviews.forEach((r) => {
      if (!r || typeof r.rating !== "number") return;
      const rate = Math.min(Math.max(Math.round(r.rating), 1), 5); // Ensure rate is between 1-5
      counts[rate]++;
      total += r.rating;
      validRatings++;
    });

    const avg = validRatings > 0 ? (total / validRatings).toFixed(1) : "0.0";

    return {
      average: parseFloat(avg),
      totalRatings: validRatings,
      totalReviews: validRatings,
      breakdown: counts,
    };
  }, [allReviews]);

  const maxCount = Math.max(...Object.values(summary.breakdown));

  return (
    <Card className="overflow-hidden transition-all duration-200">
      <CardHeader>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-3">
          Rating & Reviews
        </h2>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ⭐ TOP SECTION */}
        <div className="flex flex-col md:flex-row flex-wrap justify-between items-start gap-6">
          {/* LEFT SIDE */}
          <div className="w-full md:w-[240px] text-center p-6 bg-white shadow-sm rounded-md">
            <h4 className="text-6xl font-bold text-gray-800 leading-none">
              {summary.average > 0 ? summary.average : "–"}
            </h4>
            <div className="flex justify-center mt-2 mb-1 gap-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <IoStar
                  key={i}
                  className={
                    i < Math.round(summary.average)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-2">
              ({summary.totalRatings} Ratings & {summary.totalReviews} Reviews)
            </p>
          </div>

          {/* RIGHT SIDE - Progress Bars */}
          <div className="flex-1 min-w-[280px]">
            {summary.totalRatings > 0 ? (
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = summary.breakdown[star];
                  const percentage =
                    maxCount > 0 ? (count / maxCount) * 100 : 0;
                  return (
                    <div
                      key={star}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <div className="flex items-center gap-1 w-[55px]">
                        <span className="text-sm font-medium">{star}</span>
                        <IoStar className="text-yellow-500 text-[14px]" />
                      </div>
                      <Progress
                        value={percentage}
                        className="h-2.5 flex-1 bg-gray-200 rounded-full [&>div]:bg-red-700"
                      />
                      <span className="text-sm w-[35px] text-right text-gray-600">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No ratings yet.</p>
            )}
          </div>

          {/* BUTTON */}
          <div className="w-full md:w-auto text-center md:text-right">
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-fit py-5 px-10 border-gray-300 hover:bg-gray-100 transition-all duration-200"
              onClick={() => setWriteReview(!writeReview)}
            >
              Write Review
            </Button>
          </div>
        </div>

        {/* ✨ FORM SECTION */}
        {writeReview && (
          <div className="mt-10 border-t pt-8">
            <h3 className="text-4xl font-semibold text-gray-800 mb-6 text-center">
              Write Your Review
            </h3>
            {!auth ? (
              <>
                <p className="mb-2 text-center text-gray-600">
                  Please login to submit your review
                </p>
                <div className="text-center">
                  <Button type="button" asChild>
                    <Link href={`${WEBSITE_LOGIN}?callback=${currentUrl}`}>
                      Login
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleReviewSubmit)}
                  className="space-y-6"
                >
                  {/* Rating */}
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Rating
                            value={field.value}
                            size="large"
                            onChange={(_, value) => field.onChange(value || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter Title"
                            className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Review */}
                  <FormField
                    control={form.control}
                    name="review"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Review
                        </FormLabel>
                        <FormControl>
                          <textarea
                            placeholder="Write your detailed review here..."
                            className="rounded-lg border border-gray-600 p-3 shadow focus:ring-2 focus:ring-purple-500 h-32 w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit */}
                  <div className="max-w-xs mx-auto">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center items-center bg-purple-600 hover:bg-purple-700 text-white py-5 rounded-lg transition-all duration-200"
                    >
                      {loading ? (
                        <>
                          <Loader className="animate-spin mr-2 h-4 w-4" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Review"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        )}

        {/* Reviews Display Section */}
        <div className="mt-8 space-y-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Customer Reviews
          </h3>

          {isLoading ? (
            <div className="text-center py-8">
              <Loader className="animate-spin h-8 w-8 mx-auto mb-4" />
              <p>Loading reviews...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error loading reviews: {error.message}
            </div>
          ) : allReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No reviews yet. Be the first to review this product!
            </div>
          ) : (
            <>
              {/* Reviews Grid Section */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allReviews
                    .slice(0, showAll ? allReviews.length : 3)
                    .map((review, index) => (
                      <div
                        key={review._id || index}
                        className="border border-gray-200 rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold capitalize text-gray-900 text-lg">
                              {review.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                              <span>{review?.reviewedBy || "Anonymous"}</span>
                              <span>•</span>
                              <span>
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Rating
                            value={review.rating}
                            readOnly
                            size="medium"
                            className="text-yellow-500"
                          />
                        </div>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {review.review}
                        </p>
                      </div>
                    ))}
                </div>

                {/* Show More / Show Less Button */}
                {allReviews.length > 3 && (
                  <div className="text-center pt-6">
                    <Button
                      onClick={() => setShowAll(!showAll)}
                      variant="outline"
                      className="px-6 py-3 border-gray-300 hover:bg-gray-100 transition-all duration-200"
                    >
                      {showAll ? "Show Less Reviews" : "Show More Reviews"}
                    </Button>
                  </div>
                )}
              </div>

              {hasNextPage && (
                <div className="text-center pt-4">
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetching}
                    variant="outline"
                    className="w-full md:w-auto"
                  >
                    {isFetching ? (
                      <>
                        <Loader className="animate-spin mr-2 h-4 w-4" />
                        Loading more...
                      </>
                    ) : (
                      "Load more reviews"
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductReview;
