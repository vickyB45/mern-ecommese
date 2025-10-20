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

    // Razorpay instance
      // Validate environment variables (do not log secrets)
    const keyId =  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET  || "9SJR3etujqfsno6VLpLw8xAt"
    console.log(keyId,keySecret)
      if (!keyId || !keySecret) {
        console.error("Razorpay keys missing. keyId present:", Boolean(keyId));
        return response(false, 500, "Payment gateway configuration missing on server");
      }

      const razInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });

      const razOption = {
        amount: Number(amount) * 100, // in paise
        currency: "INR",
      };

      try {
        const orderDetail = await razInstance.orders.create(razOption);
        if (!orderDetail || !orderDetail.id) {
          console.error("Razorpay returned invalid order detail:", orderDetail);
          return response(false, 500, "Failed to create order with payment gateway");
        }

        // ✅ Return as object for frontend safety
        return response(true, 200, "Order Id Generated", { order_id: orderDetail.id });
      } catch (razErr) {
        console.error("Razorpay orders.create error:", razErr && razErr.message ? razErr.message : razErr);
        return response(false, 500, "Payment gateway error: " + (razErr?.message || "Unknown error"));
      }
  } catch (error) {
    console.error("Backend /get-order-id error:", error);
    return catchError(error);
  }
}
