"use client";

import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import Filter from "@/components/Aplication/website/Filter";
import Sorting from "@/components/Aplication/website/Sorting";
import WebsiteBreadcrumb from "@/components/Aplication/website/WebsiteBreadcrumb";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import useWindowSize from "@/hooks/useWindowSize";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/Aplication/website/ProductCart";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const breadCrumb = {
  title: "Shop",
  links: [
    {
      label: "Shop",
      href: WEBSITE_SHOP,
    },
  ],
};

const MenCollection = () => {
  const searchParams = useSearchParams();
  const searchString = searchParams ? searchParams.toString() : "";

  const [limit, setLimit] = useState(9);
  const [sorting, setSorting] = useState("default_sorting");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const windowSize = useWindowSize();
  const isDesktop = windowSize?.width > 1024;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch function for infinite query
  const fetchProducts = async ({ pageParam = 0 }) => {
    const res = await fetch(
      `${baseUrl}/shop?page=${pageParam}&limit=${limit}&sort=${sorting}&${searchString}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();
    const products = data?.data?.products || [];

    return {
      data: products,
      nextCursor: products.length >= limit ? pageParam + 1 : undefined,
    };
  };

  // React Query Infinite Scroll
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["shop", limit, sorting, searchString],
    queryFn: fetchProducts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // Flatten pages only if data exists
  const products = data?.pages?.flatMap((page) => page.data) || [];

  // Intersection Observer for Infinite Scroll
  const loadMoreRef = useRef(null);
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      {/* Breadcrumb */}
      <WebsiteBreadcrumb props={breadCrumb} />

      {/* Sidebar + Main Content */}
      <section className="lg:flex lg:px-20 px-4 lg:my-20 gap-4">
        {/* Sidebar */}
        {isDesktop ? (
          <aside className="w-72">
            <div className="sticky top-0 bg-gray-50 p-4 rounded">
              <Filter />
            </div>
          </aside>
        ) : (
          <div className="mb-4">
            <Sheet
              open={isMobileFilterOpen}
              onOpenChange={setIsMobileFilterOpen}
            >
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="border-b pb-2">Filter</SheetTitle>
                </SheetHeader>
                <div className="mt-2">
                  <Filter />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1">
          <Sorting
            sorting={sorting}
            setSorting={setSorting}
            limit={limit}
            setLimit={setLimit}
            isMobileFilterOpen={isMobileFilterOpen}
            setIsMobileFilterOpen={setIsMobileFilterOpen}
          />

          {/* Products Section */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {status === "loading" ? (
              // ✅ Skeleton Loader while fetching
              Array.from({ length: limit }).map((_, index) => (
                <div
                  key={index}
                  className="border p-2 rounded shadow-sm animate-pulse"
                >
                  <Skeleton height={150} />
                  <div className="mt-2">
                    <Skeleton width={`80%`} height={20} />
                    <Skeleton width={`50%`} height={20} className="mt-1" />
                  </div>
                </div>
              ))
            ) : status === "error" ? (
              <p className="text-red-500">
                Error fetching products: {error.message}
              </p>
            ) : products.length > 0 ? (
              products.map((product, index) => (
                <ProductCard key={index} product={product} tag="men" />
              ))
            ) : (
              // Only show "No products found" after loading completes
              Array.from({ length: limit }).map((_, index) => (
                <div
                  key={index}
                  className="border p-2 rounded shadow-sm animate-pulse"
                >
                  <Skeleton height={150} />
                  <div className="mt-2">
                    <Skeleton width={`80%`} height={20} />
                    <Skeleton width={`50%`} height={20} className="mt-1" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Infinite Scroll Trigger */}
          <div ref={loadMoreRef} className="text-center mt-6">
            {isFetchingNextPage
              ? 
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {
                  Array.from({ length: limit }).map((_, index) => (
                <div
                  key={index}
                  className="border p-2 rounded shadow-sm animate-pulse"
                >
                  <Skeleton height={150} />
                  <div className="mt-2">
                    <Skeleton width={`80%`} height={20} />
                    <Skeleton width={`50%`} height={20} className="mt-1" />
                  </div>
                </div>
              ))
                }
              </div>
              : hasNextPage
              ? "Scroll down to load more"
              : "No more products"}
          </div>
        </main>
      </section>
    </div>
  );
};

export default MenCollection;
