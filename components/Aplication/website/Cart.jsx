"use client";

import React, { useState } from "react";
import { BsCart2 } from "react-icons/bs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { removeFromCart } from "@/store/reducer/cartReducer";
import Link from "next/link";
import { WEBSITE_CART, WEBSITE_CHECKOUT } from "@/routes/WebsiteRoute";
// import { removeFromCart } from "@/redux/slices/cartSlice"; // 🔹 uncomment when remove slice is ready

const Cart = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const cart = useSelector((store) => store.cartStore || {});
  const products = cart?.products || [];
  const totalItems = products.length || 0;

  // 🔹 Calculate Totals
  const totalMRP = products.reduce(
    (sum, p) => sum + (p.mrp || p.sellingPrice || 0) * (p.quantity || 1),
    0
  );
  const totalSelling = products.reduce(
    (sum, p) => sum + (p.sellingPrice || 0) * (p.quantity || 1),
    0
  );
  const totalDiscount = totalMRP - totalSelling;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* 🛒 Cart Icon */}
      <SheetTrigger className="relative">
        <BsCart2
          className="text-zinc-500 hover:text-primary cursor-pointer"
          size={20}
        />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] px-[6px] py-[1px] rounded-full">
            {totalItems}
          </span>
        )}
      </SheetTrigger>

      {/* 🛍️ Cart Drawer */}
      <SheetContent className="flex flex-col h-full sm:w-[500px] w-full">
        <SheetHeader>
          <SheetTitle>My Cart</SheetTitle>
          <SheetDescription>Your shopping cart summary</SheetDescription>
        </SheetHeader>

        {/* 🧺 Scrollable Product List */}
        <div className="flex-1 overflow-y-auto mt-4 px-2 pr-3 scrollbar-thin scrollbar-thumb-gray-300">
          {totalItems === 0 ? (
            <div className="flex h-full justify-center items-center text-lg text-muted-foreground">
              Your Cart is Empty 🛍️
            </div>
          ) : (
            products.map((product) => {
              // ✅ Image handling
              let imageSrc = "/assets/images/img-placeholder.webp";
              if (Array.isArray(product.media) && product.media.length > 0) {
                const firstMedia = product.media[0];
                if (
                  typeof firstMedia === "string" &&
                  firstMedia.startsWith("http")
                ) {
                  imageSrc = firstMedia;
                } else if (
                  typeof firstMedia === "object" &&
                  firstMedia?.secure_url?.startsWith("http")
                ) {
                  imageSrc = firstMedia.secure_url;
                }
              } else if (
                typeof product.media === "string" &&
                product.media.startsWith("http")
              ) {
                imageSrc = product.media;
              }

              return (
                <div
                  key={product?.productId || product?._id}
                  className="flex items-center gap-4 mb-3 border-b pb-4"
                >
                  <Image
                    src={imageSrc}
                    height={80}
                    width={80}
                    alt={product?.name || "Product Image"}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex flex-col flex-1">
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">
                      {product?.name || "Untitled Product"}
                    </p>
                    <p
                      className={`text-xs ${
                        product?.color
                          ? `text-[${product?.color}]`
                          : "text-gray-500"
                      } `}
                    >
                      Color: {product?.color || "Not Avalable"} <br />
                      Size: {product?.size || "Not Avalable"}
                    </p>
                    <p className="text-xs text-gray-500">
                      ₹{product?.sellingPrice || 0} × {product?.quantity || 1}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      dispatch(
                        removeFromCart({
                          productId: product.productId || product._id,
                          variantId:
                            product.variantId || product.variant?._id || null,
                        })
                      )
                    }
                    className="text-xs text-red-500 mt-1 hover:underline self-start"
                  >
                    Remove
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* 🧾 Footer - Fixed at Bottom */}
        {totalItems > 0 && (
          <div className="border-t bg-white mt-auto py-4 px-3 sticky bottom-0">
            <div className="text-sm text-gray-600 flex justify-between">
              <span>MRP Total:</span>
              <span>₹{totalMRP.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-600 flex justify-between">
              <span>Selling Price:</span>
              <span>₹{totalSelling.toFixed(2)}</span>
            </div>
            <div className="text-sm text-green-600 flex justify-between font-medium">
              <span>Total Discount:</span>
              <span>- ₹{totalDiscount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="font-semibold text-gray-800 text-lg">
                Total: ₹{totalSelling.toFixed(2)}
              </span>
            </div>
            <div  className="flex justify-between items-center mt-6">
              <Button onClick={()=>setOpen(false)} className=" hover:bg-black/10 text-primary border rounded-lg bg-transparent ">
               <Link href={WEBSITE_CART} > View Cart</Link>
              </Button>
              <Button onClick={()=>setOpen(false)} className="bg-primary text-white hover:bg-primary/90">
                <Link href={WEBSITE_CHECKOUT}>Checkout</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
