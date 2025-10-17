import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white cursor-pointer border border-gray-200 overflow-hidden transition-all duration-300 max-w-xs mx-auto hover:shadow-md">
      {/* 👇 Disable prefetch for faster runtime navigation */}
      <Link href={WEBSITE_PRODUCT_DETAILS(product.slug)} prefetch={false}>
        {/* Image Section */}
        <div className="relative">
          <div className="h-[200px] lg:h-[350px] overflow-hidden">
            {/* 👇 Optimized Next.js Image component */}
            <Image
              src={product.media?.[0]?.secure_url || "/placeholder.png"}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
              unoptimized={false}
            />
          </div>

          {/* ✅ Discount badge (top-right) */}
          {product.discountPercentage && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-[12px] font-bold px-2 py-1 rounded-full shadow-sm">
              -{product.discountPercentage}%
            </span>
          )}
        </div>

        {/* Details Section */}
        <div className="p-4">
          <h3 className="sm:text-[15px] text-[13px] font-bold text-gray-900 leading-tight mb-2">
            {product.name}
          </h3>

          <div className="flex items-center space-x-2 mb-1">
            <span className="text-gray-900 font-semibold sm:text-[17px] text-[15px]">
              ₹{product.sellingPrice}.00
            </span>
            <span className="text-gray-400 line-through sm:text-[13px] text-[11px]">
              ₹{product.mrp}.00
            </span>
          </div>

          <span className="text-gray-400 uppercase sm:text-[13px] text-[12px]">
            {product?.category?.name}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
