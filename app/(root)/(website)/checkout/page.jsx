"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WebsiteBreadcrumb from "@/components/Aplication/website/WebsiteBreadcrumb";
import {
  WEBSITE_CART,
  WEBSITE_CHECKOUT,
  WEBSITE_ORDER_DETAILS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import { Button } from "@/components/ui/button";
import { addIntoCart, clearCart } from "@/store/reducer/cartReducer";
import { showToast } from "@/lib/showToast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Script from "next/script";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Breadcrumb config
const breadCrumb = {
  title: "Checkout",
  links: [
    { label: "Cart", href: WEBSITE_CART },
    { label: "Checkout", href: WEBSITE_CHECKOUT },
  ],
};

// Zod schema for checkout validation
const checkoutSchema = z.object({
  name: z.string().min(2, "Full Name is required"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().min(5, "Address is required"),
  country: z.string().optional().or(z.literal("")),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  userId: z.string().optional(),
});

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((store) => store.cartStore);
  const auth = useSelector((store) => store.authStore);

  // State
  const [verifyCartData, setVerifyCartData] = useState([]);
  const [cartVerified, setCartVerified] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(false);

  // Form setup
  const { register, handleSubmit, formState: { errors } } = useForm({
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

  // Cart verification
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
        dispatch(clearCart());
        cartData.forEach((item) => dispatch(addIntoCart(item)));
        setCartVerified(true);
      } else {
        showToast({ type: "error", message: data.message || "Cart verification failed!" });
      }
    } catch (error) {
      console.error("Cart verification error:", error);
      showToast({ type: "error", message: "Something went wrong verifying cart!" });
    }
  };

  useEffect(() => {
    if (cart.products.length > 0 && !cartVerified) verifyCart();
  }, [cart.products, cartVerified]);

  useEffect(() => {
    if (cartVerified) {
      const verifiedCount = verifyCartData?.reduce((acc, it) => acc + (it.quantity || 0), 0) || 0;
      const currentCount = cart.products.reduce((acc, it) => acc + (it.quantity || 0), 0);
      if (currentCount !== verifiedCount) setCartVerified(false);
    }
  }, [cart.products, cartVerified, verifyCartData]);

  // Coupon handling
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      showToast({ type: "error", message: "Please enter a coupon code!" });
      return;
    }
    setLoadingCoupon(true);
    try {
      const subtotal = cart.products.reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0);
      const res = await fetch("/api/verify-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setCouponDiscount(data.data.discountAmount);
        setCouponApplied(true);
        showToast({ type: "success", message: `Coupon applied! ${data.data.discountPercentage}% discount.` });
      } else {
        setCouponDiscount(0);
        setCouponApplied(false);
        showToast({ type: "error", message: data.message || "Invalid coupon code!" });
      }
    } catch (error) {
      setCouponDiscount(0);
      showToast({ type: "error", message: "Error applying coupon!" });
    } finally {
      setLoadingCoupon(false);
    }
  };

  // Calculate totals
  const subtotal = cart.products.reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0);
  const totalMrp = cart.products.reduce((acc, item) => acc + item.mrp * item.quantity, 0);
  const discount = totalMrp - subtotal;

  // Get Razorpay order ID
  const getOrderId = async (amount) => {
    try {
      const res = await axios.post("/api/payment/get-order-id", { amount });
      const data = res.data;
      if (!data.success) throw new Error(data.message || "Failed to get order ID");
      const order_id = data.data?.order_id || data.data;
      if (!order_id) throw new Error("Order ID missing from backend");
      return { success: true, order_id };
    } catch (error) {
      console.error("getOrderId error:", error);
      return { success: false, message: error.message };
    }
  };

  // Submit order & Razorpay
  const onSubmit = async (data) => {
    setSubmittingOrder(true);
    try {
      const totalAmount = Math.round(subtotal - couponDiscount);
      const orderResult = await getOrderId(totalAmount);
      if (!orderResult.success) throw new Error(orderResult.message);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        currency: "INR",
        name: "OM ENTERPRISES",
        description: "Payment for order",
        order_id: orderResult.order_id,
        image: "/assets/images/logo.png", // use hosted image in prod
        handler: async function (response) {
          setOrderConfirmation(true);
          try {
            const products = cart.products.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              name: item.name,
              quantity: item.quantity,
              mrp: item.mrp,
              sellingPrice: item.sellingPrice,
              discount: item.discount || 0,
            }));

            const payload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              name: data.name,
              email: data.email,
              phone: data.phone,
              address: data.address,
              country: data.country,
              state: data.state,
              city: data.city,
              pincode: data.pincode,
              userId: data.userId,
              products,
              subTotal: subtotal,
              discount,
              couponDiscount,
              totalAmount: totalAmount,
            };

            const res = await axios.post("/api/payment/verify-payment", payload);
            if (res.data.success) {
              showToast({ type: "success", message: "Payment successful! Order placed." });
              dispatch(clearCart());
              router.push(WEBSITE_ORDER_DETAILS(response.razorpay_order_id));
            } else {
              showToast({ type: "error", message: res.data.message || "Payment verification failed!" });
            }
          } catch (err) {
            console.error("verify-payment error:", err);
            showToast({ type: "error", message: err?.message || "Error verifying payment!" });
          } finally {
            setOrderConfirmation(false);
          }
        },
        prefill: { name: data.name, email: data.email, contact: data.phone },
        theme: { color: "#A81F29" },
      };

      const rzp = new Razorpay(options);
      rzp.on("payment.failed", function (response) {
        showToast({ type: "error", message: response.error.description || "Payment failed!" });
      });
      rzp.open();
    } catch (error) {
      console.error("Order submission error:", error);
      showToast({ type: "error", message: error.message || "Order placement failed!" });
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Empty cart UI
  if (cart.products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 ">
        <WebsiteBreadcrumb props={breadCrumb} />
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-semibold mt-4">Your Cart is Empty</h2>
          <p className="text-gray-500 mt-2">Looks like you haven’t added anything yet.</p>
          <Link href={WEBSITE_SHOP}>
            <Button className="mt-6">Go Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      {orderConfirmation && (
        <div className="absolute top-[20%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
          <Image src="/assets/images/loading.svg" height={60} width={60} alt="loading" />
        </div>
      )}
      <WebsiteBreadcrumb props={breadCrumb} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Billing Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input type="text" placeholder="Full Name *" {...register("name")} className="border p-3 rounded-md w-full" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input type="text" placeholder="Phone Number *" {...register("phone")} className="border p-3 rounded-md w-full" />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input type="email" placeholder="Email Address" {...register("email")} className="border p-3 rounded-md w-full" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Full Address *</label>
              <textarea rows="3" placeholder="Full Address *" {...register("address")} className="border p-3 rounded-md w-full"></textarea>
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input type="text" placeholder="City *" {...register("city")} className="border p-3 rounded-md w-full" />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                                <input type="text" placeholder="Country" {...register("country")} className="border p-3 rounded-md w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State *</label>
                <input type="text" placeholder="State *" {...register("state")} className="border p-3 rounded-md w-full" />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pincode *</label>
                <input type="text" placeholder="Pincode *" {...register("pincode")} className="border p-3 rounded-md w-full" />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full py-3 text-lg mt-6" disabled={submittingOrder}>
              {submittingOrder ? "Placing Order..." : "Place Order"}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 border-b pb-4">
            {cart.products.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium">{item.name.length > 25 ? item.name.slice(0, 25) + "..." : item.name}</p>
                  <p className="text-gray-500">Qty: {item.quantity} × ₹{item.sellingPrice}</p>
                </div>
                <p className="font-semibold">₹{item.sellingPrice * item.quantity}</p>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Total MRP:</span><span>₹{totalMrp}</span></div>
            <div className="flex justify-between text-green-600 font-medium"><span>Discount:</span><span>- ₹{discount}</span></div>
            <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between"><span>Shipping:</span><span>₹0</span></div>
            <div className="flex justify-between"><span>Coupon Discount:</span><span>- ₹{couponDiscount.toFixed(2)}</span></div>

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
                <Button onClick={handleApplyCoupon} className="py-2 px-4" disabled={loadingCoupon}>
                  {loadingCoupon ? "Checking..." : "Apply"}
                </Button>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-2 bg-green-600/15 border border-green-600/30 rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 font-medium">
                      Coupon <span className="font-semibold uppercase">{couponCode}</span> applied successfully!
                    </p>
                    <p className="text-sm text-green-600">You’ve got ₹{couponDiscount.toFixed(2)} off on your total.</p>
                  </div>
                  <button
                    onClick={() => { setCouponApplied(false); setCouponCode(""); setCouponDiscount(0); }}
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

