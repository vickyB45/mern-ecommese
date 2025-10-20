"use client";
import WebsiteBreadcrumb from "@/components/Aplication/website/WebsiteBreadcrumb";
import {
  WEBSITE_CART,
  WEBSITE_CHECKOUT,
  WEBSITE_PRODUCT_DETAILS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "@/store/reducer/cartReducer";
import { IoTrashOutline } from "react-icons/io5";
import { HiMinus, HiPlus } from "react-icons/hi";

const breadCrumb = {
  title: "Cart",
  links: [{ label: "Cart", href: WEBSITE_CART }],
};

const CartPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((store) => store.cartStore);

  const handleRemove = (productId, variantId) => {
    dispatch(removeFromCart({ productId, variantId }));
  };

  // ✅ Calculate subtotal (based on selling price)
  const subtotal = cart.products.reduce(
    (acc, item) => acc + item.sellingPrice * item.quantity,
    0
  );

  // ✅ Calculate total MRP
  const totalMrp = cart.products.reduce(
    (acc, item) => acc + item.mrp * item.quantity,
    0
  );

  // ✅ Calculate discount dynamically
  const discount = totalMrp - subtotal;

  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumb} />

      {cart.count === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-semibold mt-4">Your Cart is Empty</h2>
          <p className="text-gray-500 mt-2">
            Looks like you haven’t added anything yet.
          </p>
          <Link href={WEBSITE_SHOP}>
            <Button className="mt-6">Go Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="md:py-10 py-5 max-w-6xl mx-auto px-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.products.map((item, index) => (
              <div
                key={index}
                className="relative flex flex-col sm:flex-row items-start bg-white shadow-md rounded-lg p-3 gap-4"
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.productId, item.variantId)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                >
                  <IoTrashOutline size={20} />
                </button>

                {/* Product Image */}
                <Image
                  src={item.media || "/placeholder.png"}
                  width={100}
                  height={100}
                  alt={item.name}
                  className="rounded w-[100px] h-[100px] object-cover"
                />

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-center">
                  <Link href={WEBSITE_PRODUCT_DETAILS(item.url)}>
                    <h3 className="font-medium hover:underline text-base sm:text-lg">
                      {item.name.length > 80
                        ? item.name.slice(0, 80) + "..."
                        : item.name}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap gap-2 mt-2 items-center">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                     Size: {item.size}
                    </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                     Color: {item.color}
                    </span>
                    
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 items-center">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                      ₹{item.sellingPrice}
                    </span>
                    {item.mrp > item.sellingPrice && (
                      <span className="text-sm text-green-600 font-medium">
                        Save ₹{(item.mrp - item.sellingPrice) * item.quantity}
                      </span>
                    )}
                  </div>

                  {/* ✅ Quantity Controls */}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      className="h-8 w-8 flex justify-center items-center rounded-full border border-gray-300 hover:bg-gray-100"
                      onClick={() =>
                        dispatch(
                          decreaseQuantity({
                            productId: item.productId,
                            variantId: item.variantId,
                          })
                        )
                      }
                    >
                      <HiMinus />
                    </button>

                    <input
                      type="text"
                      value={item.quantity}
                      className="w-10 text-center border border-gray-200 rounded-md outline-none"
                      readOnly
                    />

                    <button
                      type="button"
                      className="h-8 w-8 flex justify-center items-center rounded-full border border-gray-300 hover:bg-gray-100"
                      onClick={() =>
                        dispatch(
                          increaseQuantity({
                            productId: item.productId,
                            variantId: item.variantId,
                          })
                        )
                      }
                    >
                      <HiPlus />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="w-full h-fit lg:sticky lg:top-20 border rounded-lg p-6 bg-white shadow-md mt-2">
            <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>

            <div className="flex justify-between mb-2">
              <span>Total MRP:</span>
              <span>₹{totalMrp}</span>
            </div>

            <div className="flex justify-between mb-2 text-green-600 font-medium">
              <span>Discount:</span>
              <span>- ₹{discount}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>₹0</span>
            </div>

            <div className="border-t my-2"></div>

            <div className="flex justify-between font-semibold text-lg mb-4">
              <span>Total Payable:</span>
              <span>₹{subtotal}</span>
            </div>

            <Button  className="w-full py-3 text-lg">
              <Link href={WEBSITE_CHECKOUT}>Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
