// import mongoose from "mongoose";

// const MONGODB_URL = process.env.MONGODB_URI;

// if (!MONGODB_URL) {
//   throw new Error("❌ Please define the MONGODB_URI in .env.local");
// }

// // Cache mongoose connection (for hot reload in dev)
// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// export const connectDB = async () => {
//   // Already connected?
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     const opts = {
//       dbName: "NZ-NEXTJS-ECOMMERCE",
//       bufferCommands: false,
//       serverSelectionTimeoutMS: 5000,
//       socketTimeoutMS: 45000,
//       family: 4,
//     };

//     cached.promise = mongoose.connect(MONGODB_URL, opts);
//   }

//   try {
//     cached.conn = await cached.promise;

//     // ✅ Ye actual connection object hai
//     const connection = mongoose.connection;

//     connection.on("connected", () => {
//       console.log("✅ MongoDB connected successfully");
//     });

//     connection.on("error", (err) => {
//       console.error("❌ MongoDB connection error:", err);
//     });

//     connection.on("disconnected", () => {
//       console.warn("⚠️ MongoDB disconnected");
//     });

//     return cached.conn;
//   } catch (error) {
//     console.error("❌ Failed to connect to MongoDB:", error);
//     throw error;
//   }
// };

import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URI;

if (!MONGODB_URL) {
  throw new Error("❌ Please define the MONGODB_URI in .env.local");
}

let cached = global.mongoose || { conn: null, promise: null };

export const connectDB = async () => {
  if (cached.conn) return cached.conn; // ✅ Reuse existing connection

  if (!cached.promise) {
    const opts = {
      dbName: "NZ-NEXTJS-ECOMMERCE",
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000, // reduced
      socketTimeoutMS: 20000,         // reduced
      family: 4,
    };

    cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongoose) => {
      console.log("✅ MongoDB Connected:", mongoose.connection.host);
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached; // ✅ Store globally (for hot reloads)
  return cached.conn;
};

