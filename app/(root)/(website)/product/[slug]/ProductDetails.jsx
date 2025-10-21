"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  WEBSITE_CART,
  WEBSITE_CHECKOUT,
  WEBSITE_HOME,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";

import {
  Star,
  Truck,
  RefreshCcw,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

import ProductDescription from "@/components/Aplication/website/ProductDescription";
import ProductCard from "@/components/Aplication/website/ProductCart";
import ProductReview from "@/components/Aplication/website/ProductReview";

import { useDispatch, useSelector } from "react-redux";
import { addIntoCart } from "@/store/reducer/cartReducer";
import { showToast } from "@/lib/showToast";

const ProductDetails = ({
  product,
  variant,
  colors,
  sizes,
  reviewCount,
  similarProducts,
}) => {

  
  const dispatch = useDispatch();
  const cartStore = useSelector((store) => store.cartStore);
  
  const [isAddedIntoCart, setIsAddedIntoCart] = useState(false);
  const [thumbnails, setThumbnails] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [like, setLike] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Loading state derived from product data and image load
  const loading = !product;

  useEffect(() => {
    if (cartStore?.count > 0) {
      const existingProduct = cartStore.products.findIndex(
        (cartProduct) =>
          cartProduct.productId === product?._id &&
          cartProduct.variantId === variant?._id
      );
      setIsAddedIntoCart(existingProduct >= 0);
    } else {
      setIsAddedIntoCart(false);
    }
  }, [cartStore, product, variant]);

  useEffect(() => {
    if (product && Object.keys(product).length > 0) {
      const urls = product.media?.map((m) => m.secure_url) || [];
      setThumbnails(urls);
      setActiveImage(urls[0]);
      setImageLoaded(false); // Wait for main image to load
    }
  }, [product]);
  
  const handleAddToCart = () => {
    const cartProduct = {
      productId: product?._id,
      variantId: variant?._id,
      name: product?.name,
      url: product?.slug,
      size: variant?.size,
      color: variant?.color,
      mrp: product?.mrp,
      sellingPrice: product?.sellingPrice,
      media: product?.media?.[0]?.secure_url,
      quantity: quantity,
    };

    dispatch(addIntoCart(cartProduct));
    setIsAddedIntoCart(true);
    showToast({ type: "success", message: "Product added into cart" });
  };

  // 🔹 SKELETON UI while loading
  if (loading) {
    return (
      <div className="min-h-screen animate-pulse px-4 lg:px-20 py-10">
        <div className="mb-6">
          <Skeleton className="h-5 w-1/3 mb-3" />
          <Skeleton className="h-4 w-1/5" />
        </div>

        <div className="lg:flex lg:gap-10">
          {/* Left Image Skeleton */}
          <div className="lg:w-1/2">
            <div className="flex gap-3">
              <Skeleton className="w-20 h-20 rounded-md" />
              <Skeleton className="w-20 h-20 rounded-md" />
              <Skeleton className="w-20 h-20 rounded-md" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-xl mt-4" />
          </div>

          {/* Right Details Skeleton */}
          <div className="lg:w-1/2 mt-10 lg:mt-0 space-y-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-3">
              <Skeleton className="h-12 w-1/2 rounded-md" />
              <Skeleton className="h-12 w-1/2 rounded-md" />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-24 w-full" />
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-md p-3">
              <Skeleton className="h-[200px] w-full rounded-md mb-3" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ✅ MAIN PRODUCT PAGE AFTER LOAD
  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="lg:px-20 px-4 py-10">
        <Breadcrumb className="text-gray-600">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={WEBSITE_HOME}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={WEBSITE_SHOP}>Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                {product?.name
                  ? product.name.length > 15
                    ? product.name.slice(0, 15) + "..."
                    : product.name
                  : ""}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Product Section */}
      <div className="lg:flex lg:items-start lg:gap-10 lg:px-20 px-2">
        {/* Left: Images */}
        <div className="flex flex-col-reverse lg:flex-row lg:w-1/2 gap-4 mb-10 lg:mb-0">
          {/* Thumbnails */}
          <div className="flex lg:flex-col flex-row justify-center gap-2 overflow-x-auto lg:overflow-y-auto">
            {thumbnails.map((thumb, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImage(thumb)}
                className={`cursor-pointer border rounded-md overflow-hidden ${
                  activeImage === thumb
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={thumb}
                  alt={`Thumbnail ${idx}`}
                  width={90}
                  height={90}
                  className="w-20 h-20 object-cover"
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative flex-1 rounded-2xl h-[450px] sm:h-[500px] overflow-hidden shadow-md">
            {activeImage && (
              <Image
                src={activeImage}
                alt={product?.name}
                width={600}
                height={600}
                className="w-full h-full object-cover rounded-2xl"
                onLoadingComplete={() => setImageLoaded(true)}
              />
            )}
            <button
              onClick={() => setLike(!like)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:scale-105 transition"
            >
              {like ? (
                <FaHeart className="text-red-600" size={20} />
              ) : (
                <FaRegHeart className="text-gray-600" size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:w-1/2">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {product?.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                }
              />
            ))}
            <span className="ml-2 text-gray-600 text-sm">
              ({reviewCount || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <p className="text-3xl font-semibold text-gray-800">
              ₹{product?.sellingPrice || "0.00"}
            </p>
            {product?.mrp && (
              <p className="text-gray-400 line-through text-lg">
                ₹{product?.mrp}
              </p>
            )}
            {product?.discountPercentage && (
              <p className="text-red-500 font-medium">
                {product.discountPercentage}% OFF
              </p>
            )}
          </div>

          {/* Short Description */}
          <p className="text-gray-600 mb-6">
            {product?.shortDescription ||
              "Premium quality product crafted with attention to detail."}
          </p>

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-gray-700 font-medium mb-2">Quantity</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="border rounded-md w-10 h-10 flex items-center justify-center text-lg"
              >
                −
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="border rounded-md w-10 h-10 flex items-center justify-center text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Colors & Sizes */}
          <div className="flex justify-around items-start gap-6 mb-6">
            <div>
              <h3 className="md:text-xl font-semibold mb-2 text-gray-800">
                Available Colors
              </h3>
              <div className="flex gap-3 flex-wrap">
                {(colors?.length
                  ? colors
                  : product?.colors || ["No Color Available"]
                ).map((color, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 border rounded-full text-sm text-gray-700 bg-gray-100"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="md:text-xl font-semibold mb-2 text-gray-800">
                Available Sizes
              </h3>
              <div className="flex gap-3 flex-wrap">
                {(sizes?.length
                  ? sizes
                  : product?.sizes || ["No Size Available"]
                ).map((size, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 border rounded-full text-sm text-gray-700 bg-gray-100"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mb-6">
            {!isAddedIntoCart ? (
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-red-700 text-white py-3 rounded-md font-semibold hover:bg-red-800 transition flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            ) : (
              <Link
                href={WEBSITE_CART}
                className="flex-1 bg-red-700 text-white py-3 rounded-md font-semibold hover:bg-red-800 transition flex items-center justify-center gap-2"
              >
                Go to Cart
              </Link>
            )}

          </div>

          {/* Info List */}
          <div className="space-y-3 border-t border-gray-200 pt-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Truck size={18} className="text-red-700" />
              <span>Free shipping on orders over ₹2000</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <RefreshCcw size={18} className="text-red-700" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <ShieldCheck size={18} className="text-red-700" />
              <span>Secure checkout with SSL encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="lg:px-20 mt-16 pb-20">
        <h2 className="text-2xl  px-4 font-semibold mb-4 text-gray-800">
          Description
        </h2>
        <div className="text-gray-600 leading-relaxed px-2 mb-6">
          <ProductDescription description={product?.description} />
        </div>

        <div className="text-gray-500">
          <ProductReview productId={product?._id} />
        </div>
      </div>

      {/* Similar Products */}
      <div className="max-w-6xl mx-auto">
        <div className="text-3xl md:text-[45px] font-bold py-6">
          Similar Products
        </div>
        <div className="grid py-4 px-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-2">
          {(similarProducts || []).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
