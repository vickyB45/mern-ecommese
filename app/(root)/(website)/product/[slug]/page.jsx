
import axios from "axios";
import React from "react";
import ProductDetails from "./ProductDetails";

const ProductPage = async ({ params, searchParams }) => {
  const { slug } = await params;
  const { color, size } = await searchParams;

  // ✅ make url mutable
  let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`;

  // ✅ Query params build
  const query = new URLSearchParams();

  if (color) query.append("color", color);
  if (size) query.append("size", size);

  // ✅ Fetch product data
  const { data: getProduct } = await axios.get(
    query.toString() ? `${url}?${query.toString()}` : url
  );

  

  if (!getProduct.success) {
    return (
      <div className="flex justify-center h-[70vh] items-center py-6">
        <h3 className="text-4xl font-bold">Data Not Found!</h3>
      </div>
    );
  } else {
    const similarProducts = getProduct?.data?.similarProducts;


    return (
      <div>
        <ProductDetails
          product={getProduct?.data?.product}
          variant={getProduct?.data?.variant}
          colors={getProduct?.data?.colors}
          sizes={getProduct?.data?.sizes}
          reviewCount={getProduct?.data?.reviewCount}
          similarProducts={similarProducts} // ✅ pass as prop
        />
      </div>
    );
  }
};

export default ProductPage;
