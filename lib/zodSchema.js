import { z } from "zod";

export const loginSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(32, { message: "Password must not exceed 32 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, {
      message:
        "Password must contain at least one special character (@, $, !, %, *, ?, &)",
    }),

  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),

  _id: z.string().min(3, "_id is required"),
  alt: z.string().min(3, "Alt is required"),
  title: z.string().min(3, "Title is required"),

  slug: z.string().min(3, "Slug is required"),
  description: z.string().min(3, "Description is required"),
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({
      message: "Status must be either 'active' or 'inactive'",
    }),
  }),

  mrp: z.preprocess((val) => {
    if (typeof val === "string") return parseFloat(val);
    return val;
  }, z.number({ required_error: "MRP is required", invalid_type_error: "MRP must be a number" })
     .positive("MRP must be positive")),

  sellingPrice: z.preprocess((val) => {
    if (typeof val === "string") return parseFloat(val);
    return val;
  }, z.number({ required_error: "Selling Price is required", invalid_type_error: "Selling Price must be a number" })
     .positive("Selling Price must be positive")),

  discountPercentage: z.preprocess((val) => {
    if (typeof val === "string") return parseFloat(val);
    return val;
  }, z.number({ required_error: "Discount Percentage is required", invalid_type_error: "Discount Percentage must be a number" })
     .min(0, "Discount cannot be negative")
     .max(100, "Discount cannot be more than 100")),
    
    category: z.string().min(3, "Category is required"),
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .min(3, "Description must be at least 3 characters long"),
    media: z.array(z.string()),
     product: z
    .string().min(3,"prduct is required")
,
  sku: z
    .string()
    .nonempty("SKU required")
    .min(2, "SKU too short")
    .max(64, "SKU too long"),

  color: z.string().min(3,"Color required"),

  // If size can be a number, use: z.union([z.string(), z.number()])
  size: z.string().min(1,"Size required"),
  code: z.string().min(1,"Size required"),
  minShoppingAmmount: z.preprocess((val) => {
    if (typeof val === "string") return parseFloat(val);
    return val;
  }, z.number({ required_error: "Min Shopping Amount is required", invalid_type_error: "Min Shopping Amount must be a number" })
     .min(0, "Min Shopping Amount cannot be negative")),
    
  validity: z.coerce.date()
});
