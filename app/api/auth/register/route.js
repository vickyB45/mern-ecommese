import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { sendMail } from "@/lib/sendMail";
import { loginSchema } from "@/lib/zodSchema";
import { userModel } from "@/models/User.model";
import { SignJWT } from "jose";

export async function POST(req) {
  try {
    // ✅ 1. Connect to DB
    await connectDB();

    // ✅ 2. Validation schema
    const validationSchema = loginSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    const payload = await req.json();
    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return response(false, 401, "Invalid or Missing input fields.", validatedData.error);
    }

    const { name, email, password } = validatedData.data;

    // ✅ 3. Check existing user
    const checkUser = await userModel.exists({ email });
    if (checkUser) {
      return response(false, 409, "User already registered.");
    }

    // ✅ 4. Save new user
    const newRegistration = new userModel({ name, email, password });
    await newRegistration.save();

    // ✅ 5. Generate verification token
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({ userId: newRegistration._id.toString() })
      .setIssuedAt()
      .setExpirationTime("1h")
      .setProtectedHeader({ alg: "HS256" }) // 🔥 Correct alg (uppercase)
      .sign(secret);

    // ✅ 6. Send verification email
    const verifyLink = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-email/${token}`;
    await sendMail(
      "Email Verification request from Developer Vicky",
      email,
      emailVerificationLink(verifyLink)
    );

    // ✅ 7. Success response
    return response(true, 200, "Registration Success, Please verify your email address.");
  } catch (error) {
    // 🔥 Must RETURN this (was missing before!)
    return catchError(error);
  }
}
