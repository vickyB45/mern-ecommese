import { response } from "@/lib/helperFunctions";
import crypto from "crypto";
import { connectDB } from "@/lib/databaseConnection";
import orderModel from "@/models/order.model";
import z from "zod";
import { loginSchema } from "@/lib/zodSchema";
import { sendMail } from "@/lib/sendMail";
import { orderNotification } from "@/email/orderNotification";

export async function POST(req) {
  try {
    await connectDB();
    const payload = await req.json();

    // -----------------------------
    // Product schema
    // -----------------------------
    const productSchema = z.object({
      productId: z.string().length(24, "Invalid product id"),
      variantId: z.string().length(24, "Invalid variant id"),
      name: z.string().min(1),
      quantity: z.number().min(1), // ✅ Fixed typo
      mrp: z.number().nonnegative(),
      sellingPrice: z.number().nonnegative(),
    });

    // -----------------------------
    // Order schema
    // -----------------------------
    const orderSchema = loginSchema
      .pick({ name: true, email: true })
      .extend({
        phone: z.string().length(10, "Phone number must be 10 digits"),
        address: z.string().min(5, "Address is required"),
        country: z.string().min(2, "Country is required"),
        city: z.string().min(2, "City is required"),
        state: z.string().min(2, "State is required"),
        pincode: z.string().length(6, "Pincode must be 6 digits"),
        userId: z.string().optional(),
        razorpay_payment_id: z.string().min(3, "Payment Id is required"),
        razorpay_order_id: z.string().min(3, "Order Id is required"),
        razorpay_signature: z.string().min(3, "Signature Id is required"),
        subTotal: z.number().nonnegative(),
        discount: z.number().nonnegative(),
        couponDiscount: z.number().nonnegative(),
        totalAmount: z.number().nonnegative(),
        products: z.array(productSchema),
      });

    // -----------------------------
    // Validate request payload
    // -----------------------------
    const validate = orderSchema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing field", validate.error);
    }

    const validatedData = validate.data;

    // -----------------------------
    // Razorpay payment verification
    // -----------------------------
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${validatedData.razorpay_order_id}|${validatedData.razorpay_payment_id}`)
      .digest("hex");

    const isPaymentVerified = generatedSignature === validatedData.razorpay_signature;

    // -----------------------------
    // Save order
    // -----------------------------
   const newOrder = await orderModel.create({
  ...(validatedData.userId && { user: validatedData.userId }), // only if provided
  name: validatedData.name,        // frontend se required
  email: validatedData.email,      // frontend se required
  phone: validatedData.phone,
  country: validatedData.country,
  state: validatedData.state,
  city: validatedData.city,
  pincode: validatedData.pincode,
  address: validatedData.address,
  products: validatedData.products,
  paymentId: validatedData.razorpay_payment_id,
  orderId: validatedData.razorpay_order_id,
  status: isPaymentVerified ? "pending" : "unverified",
  totalAmount: validatedData.totalAmount,
  subTotal: validatedData.subTotal,
  discount: validatedData.discount,
  couponDiscount: validatedData.couponDiscount || 0,
});


    // -----------------------------
    // Send confirmation email
    // -----------------------------
    try {
      const mailData = {
        order_id: validatedData.razorpay_order_id,
        orderDetailsUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-details/${validatedData.razorpay_order_id}`,
      };

      await sendMail({
        subject: "Your order placed successfully",
        receiver: validatedData.email,
        body: orderNotification(mailData),
      });
    } catch (mailError) {
      console.error("Email sending error:", mailError);
    }

    // -----------------------------
    // Return response
    // -----------------------------
    return response(true, 200, "Order placed successfully", {
      paymentVerified: isPaymentVerified,
      orderId: validatedData.razorpay_order_id,
    });

  } catch (error) {
    console.error("verify-payment error:", error);
    return response(false, 500, error?.message || "Internal Server Error");
  }
}
