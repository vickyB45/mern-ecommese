import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { loginSchema } from "@/lib/zodSchema";
import Razorpay from "razorpay";

export async function POST(req) {
  try {
    await connectDB();

    const payload = await req.json();

    // Validate amount using Zod
    const schema = loginSchema.pick({ amount: true });
    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid or missing field", validate.error);
    }

    const { amount } = validate.data;

    // Razorpay keys
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay keys missing");
      return response(false, 500, "Payment gateway configuration missing on server");
    }

    const razInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const razOption = {
      amount: Number(amount) * 100, // in paise
      currency: "INR",
    };

    const orderDetail = await razInstance.orders.create(razOption);

    if (!orderDetail || !orderDetail.id) {
      return response(false, 500, "Failed to create order with payment gateway");
    }

    return response(true, 200, "Order Id Generated", { order_id: orderDetail.id });
  } catch (error) {
    console.error("Backend /get-order-id error:", error);
    return catchError(error);
  }
}
