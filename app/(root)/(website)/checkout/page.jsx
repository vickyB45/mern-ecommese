"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WebsiteBreadcrumb from "@/components/Aplication/website/WebsiteBreadcrumb";
import { WEBSITE_CART, WEBSITE_CHECKOUT } from "@/routes/WebsiteRoute";
import { Button } from "@/components/ui/button";
import { addIntoCart, clearCart } from "@/store/reducer/cartReducer";
import { showToast } from "@/lib/showToast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Script from "next/script";

// Breadcrumb configuration for navigation
const breadCrumb = {
  title: "Checkout",
  links: [
    { label: "Cart", href: WEBSITE_CART },
    { label: "Checkout", href: WEBSITE_CHECKOUT },
  ],
};

// Skeleton loader component for loading states
const Skeleton = ({ className }) => (
  <div className={`bg-gray-300 animate-pulse rounded ${className}`}></div>
);

// Zod schema for form validation
const checkoutSchema = z.object({
  name: z.string().min(2, "Full Name is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "Phone number must be 10 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")), // Optional email
  address: z.string().min(5, "Address is required"),
  country: z.string().optional().or(z.literal("")), // Optional country
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z
    .string()
    .min(6, "Pincode must be 6 digits")
    .max(6, "Pincode must be 6 digits"),
  userId: z.string().optional(),
});

const CheckoutPage = () => {
  // State for cart verification data
  const [verifyCartData, setVerifyCartData] = useState([]);
  const [cartVerified, setCartVerified] = useState(false);
  // State for coupon functionality
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  // State for order submission loading
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const dispatch = useDispatch();
  const cart = useSelector((store) => store.cartStore);
  const auth = useSelector((store) => store.authStore);

  // Function to verify cart products from backend
  const verifyCart = async () => {
    try {
      const res = await fetch("/api/cart-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: cart.products }),
      });
      const data = await res.json();

      if (data.success) {
        const cartData = data.data;
        setVerifyCartData(cartData);
        // Update store only if verification actually changed something.
        // To prevent triggering the effect again (which caused repeated requests),
        // use a cartVerified flag to mark we've synced with server.
        dispatch(clearCart()); // Clear existing cart
        cartData.forEach((cartItem) => dispatch(addIntoCart(cartItem))); // Add verified items
        setCartVerified(true);
      } else {
        showToast({
          type: "error",
          message: data.message || "Cart verification failed!",
        });
      }
    } catch (error) {
      console.error("Cart verification error:", error);
      showToast({
        type: "error",
        message: "Something went wrong verifying cart!",
      });
    }
  };

  // Effect to verify cart on component mount or cart change
  useEffect(() => {
    // Only verify when there are products and we haven't already verified them.
    if (cart.products.length > 0 && !cartVerified) {
      verifyCart();
    }
  }, [cart.products, cartVerified]);

  // If user modifies cart after verification, mark as not verified so we can re-verify
  useEffect(() => {
    if (cartVerified) {
      // simple heuristic: if number of items changed compared to verified data, reset
      const verifiedCount =
        verifyCartData?.reduce((acc, it) => acc + (it.quantity || 0), 0) || 0;
      const currentCount = cart.products.reduce(
        (acc, it) => acc + (it.quantity || 0),
        0
      );
      if (currentCount !== verifiedCount) {
        setCartVerified(false);
      }
    }
  }, [cart.products, cartVerified, verifyCartData]);

  // Function to apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      showToast({ type: "error", message: "Please enter a coupon code!" });
      return;
    }

    setLoadingCoupon(true);
    try {
      const subtotal = cart.products.reduce(
        (acc, item) => acc + item.sellingPrice * item.quantity,
        0
      );

      const res = await fetch("/api/verify-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });

      const data = await res.json();

      if (data.success) {
        setCouponDiscount(data.data.discountAmount);
        setCouponApplied(true);
        showToast({
          type: "success",
          message: `Coupon applied! ${data.data.discountPercentage}% discount added.`,
        });
      } else {
        setCouponDiscount(0);
        setCouponApplied(false);
        showToast({
          type: "error",
          message: data.message || "Invalid coupon code!",
        });
      }
    } catch (error) {
      setCouponDiscount(0);
      showToast({ type: "error", message: "Error applying coupon!" });
    } finally {
      setLoadingCoupon(false);
    }
  };

  // React Hook Form setup with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      country: "",
      city: "",
      state: "",
      pincode: "",
      userId: auth?._id || "",
    },
  });

  // Calculate totals
  const subtotal = cart.products.reduce(
    (acc, item) => acc + item.sellingPrice * item.quantity,
    0
  );
  const totalMrp = cart.products.reduce(
    (acc, item) => acc + item.mrp * item.quantity,
    0
  );
  const discount = totalMrp - subtotal;

  // Function to get order ID from backend
  // Function to get order ID from backend
  const getOrderId = async (amount) => {
    try {
      const res = await axios.post("/api/payment/get-order-id", { amount });
      const orderIdData = res.data;

      if (!orderIdData.success) {
        throw new Error(orderIdData.message || "Failed to get order ID");
      }

      // ✅ Safe extraction: works even if backend returns string or object
      const order_id = orderIdData.data?.order_id || orderIdData.data;
      if (!order_id) {
        throw new Error("Order ID backend se missing hai");
      }
      return { success: true, order_id };
    } catch (error) {
      console.error("Error in getOrderId:", error);
      return { success: false, message: error.message };
    }
  };

  // Fixed onSubmit function: Now initiates payment after getting order ID
  const onSubmit = async (data) => {
    setSubmittingOrder(true);
    try {
      const totalAmount = (subtotal - couponDiscount).toFixed(0);
      const orderResult = await getOrderId(totalAmount);

      if (!orderResult.success) {
        throw new Error(orderResult.message);
      }

      const orderId = orderResult.order_id;

      // TODO: Razorpay integration
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        currency: "INR",
        name: "OM ENTERPRISES",
        description: "Payment for order",
        order_id: orderResult.order_id,
        image:
          "http://localhost:3000/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdwpp4trl9%2Fimage%2Fupload%2Fv1760965257%2Fuploads%2Fwtvtjulk8nwvbettirlz.png&w=828&q=75",
        handler: function (response) {
          console.log("Payment successful:", response);
        },
        prefill: {
          name: data.name,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: "#A81F29",
        },
      };

      const rzp = new Razorpay(options);

      rzp.on("payment.field", function (response) {
        showToast({ type: "error", message: response.error.description });
      });

      rzp.open();

      showToast({
        type: "success",
        message: "Order ID generated!.",
      });
    } catch (error) {
      console.error("Order submission error:", error);
      showToast({
        type: "error",
        message: error.message || "Order place karne me problem!",
      });
    } finally {
      setSubmittingOrder(false);
    }
  };

  // If cart is empty, show skeleton loader
  if (cart.products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 max-w-6xl mx-auto">
        <WebsiteBreadcrumb props={breadCrumb} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Skeleton for form */}
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-40 w-full" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-12 w-1/3 mt-4" />
          </div>
          {/* Skeleton for summary */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WebsiteBreadcrumb props={breadCrumb} />

      <div className="max-w-6xl mx-auto py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Billing Form Section */}
        <div className="lg:col-span-2 bg-white p-3 md:p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Billing Details</h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Name and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Full Name *"
                  {...register("name")}
                  className="border p-3 rounded-md w-full"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  placeholder="Phone Number *"
                  {...register("phone")}
                  className="border p-3 rounded-md w-full"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Email Address"
                {...register("email")}
                className="border p-3 rounded-md w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Address *
              </label>
              <textarea
                rows="3"
                placeholder="Full Address *"
                {...register("address")}
                className="border p-3 rounded-md w-full"
              ></textarea>
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* City, Country, State, Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input
                  type="text"
                  placeholder="City *"
                  {...register("city")}
                  className="border p-3 rounded-md w-full"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Country
                </label>
                <input
                  type="text"
                  placeholder="Country"
                  {...register("country")}
                  className="border p-3 rounded-md w-full"
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  State *
                </label>
                <input
                  type="text"
                  placeholder="State *"
                  {...register("state")}
                  className="border p-3 rounded-md w-full"
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.state.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  placeholder="Pincode *"
                  {...register("pincode")}
                  className="border p-3 rounded-md w-full"
                />
                {errors.pincode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.pincode.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 text-lg mt-6"
              disabled={submittingOrder}
            >
              {submittingOrder ? "Placing Order..." : "Place Order"}
            </Button>
          </form>
        </div>

        {/* Order Summary Section */}
        <div className="bg-white p-6 rounded-xl shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 border-b pb-4">
            {cart.products.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <div>
                  <p className="font-medium">
                    {item.name.length > 25
                      ? item.name.slice(0, 25) + "..."
                      : item.name}
                  </p>
                  <p className="text-gray-500">
                    Qty: {item.quantity} × ₹{item.sellingPrice}
                  </p>
                </div>
                <p className="font-semibold">
                  ₹{item.sellingPrice * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total MRP:</span>
              <span>₹{totalMrp}</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium">
              <span>Discount:</span>
              <span>- ₹{discount}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>₹0</span>
            </div>
            <div className="flex justify-between">
              <span>Coupon Discount:</span>
              <span>- ₹{couponDiscount.toFixed(2)}</span>
            </div>

            <div className="border-t my-2"></div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Payable:</span>
              <span>₹{(subtotal - couponDiscount).toFixed(2)}</span>
            </div>

            {/* Coupon Input */}
            {!couponApplied ? (
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md flex-1 outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <Button
                  onClick={handleApplyCoupon}
                  className="py-2 px-4"
                  disabled={loadingCoupon}
                >
                  {loadingCoupon ? "Checking..." : "Apply"}
                </Button>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-2 bg-green-600/15 border border-green-600/30 rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 font-medium">
                      Coupon{" "}
                      <span className="font-semibold uppercase">
                        {couponCode}
                      </span>{" "}
                      applied successfully!
                    </p>
                    <p className="text-sm text-green-600">
                      You’ve got ₹{couponDiscount.toFixed(2)} off on your total.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setCouponApplied(false);
                      setCouponCode("");
                      setCouponDiscount(0);
                    }}
                    className="text-sm text-red-500 hover:text-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
  );
};

export default CheckoutPage;
