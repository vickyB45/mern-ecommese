import Link from "next/link";
import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import ProductCard from "./ProductCart";

const FeaturedProduct = async ({ category, title, tag }) => {
  const collection = encodeURIComponent(category);

  let productData = null;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await fetch(`${baseUrl}/product/get-featured-product?category=${collection}`, {
      cache: "no-store", // avoid caching on server
    });
    if (res.ok) {
      productData = await res.json();
    }
  } catch (error) {
    console.error("Error fetching featured products:", error);
  }

  if (!productData || !productData.data?.length) {
    return null; // or fallback UI
  }

  return (
    <section className="py-8">
      <div className="flex justify-between md:mt-6 mt-2 items-center mb-4 md:px-12 px-4">
        <h2 className="text-2xl font-semibold sm:text-4xl">{title}</h2>
        <Link
          className="flex justify-center items-center underline hover:text-primary"
          href=""
        >
          View All
          <IoIosArrowRoundForward />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-3 md:px-10">
        {productData.data.map((item) => (
          <ProductCard key={item._id} tag={tag} product={item} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProduct;
