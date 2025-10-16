import React from "react";
import WebsiteBreadcrumb from "@/components/Aplication/website/WebsiteBreadcrumb";
// import ProductCard from "@/components/Aplication/website/ProductCard";
import { WEBSITE_ACCESSORIES, WEBSITE_FOOTWARES, WEBSITE_MEN_COLLECTION } from "@/routes/WebsiteRoute";
import ProductCard from "@/components/Aplication/website/ProductCart";

const breadCrumb = {
  title: "Accessories Collections",
  links: [
    {
      label: "Accessories",
      href: WEBSITE_ACCESSORIES,
    },
  ],
};

const ManCategory = async () => {
  const category = "Accessories collection"; // Hardcoded category for now
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");

  const res = await fetch(
    `${baseUrl}/product/category-full-products?category=${encodeURIComponent(
      category
    )}`,
    { cache: "no-store" } // Always fetch fresh data on SSR
  );

  if (!res.ok) throw new Error("Failed to fetch products");

  const data = await res.json();
  const products = data?.data || [];

  return (
    <div>
      {/* Breadcrumb */}
      <WebsiteBreadcrumb props={breadCrumb} />

      {/* Category Heading */}
      <div className="px-6 md:px-16 py-10">

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} tag={category} />
            ))}
          </div>
        ) : (
          <p>No products found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default ManCategory;
