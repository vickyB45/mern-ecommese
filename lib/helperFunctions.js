import { NextResponse } from "next/server";

export const response = async (success, statusCode, message, data = null) => {
  return NextResponse.json({ success, message, data }, { statusCode });
};

//
// Catch and handle errors
export const catchError = async (error, customMessage) => {
  if (error.code === 11000) {
    const keys = Object.keys(error.keyPattern).join(",");
    error.message = `Dublicate fields: ${keys}. This is value must be unique`;
  }

  let errorObj = {};
  if (process.env.NODE_ENV === "development") {
    errorObj = {
      message: error.message,
      error,
    };
  } else {
    errorObj = {
      message: customMessage || "Internal server error.",
    };
  }
  return NextResponse.json({
    success: false,
    statusCode: error.code,
    ...errorObj,
  });
};

// Generate 6 digit OTP
export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

// role can be 'user', 'admin'

export const columnConfig = (
  column,
  isCreatedAt = false,
  isUpdatedAt = false,
  isDeletedAt = false
) => {
  const newColumn = [...column];
  if (isCreatedAt) {
    newColumn.push({
      accessorKey: "createdAt",
      header: "Created At",
      Cell: ({ renderdCellValue }) =>
        new Date(renderdCellValue).toLocaleString(),
    });
  }
  if (isUpdatedAt) {
    newColumn.push({
      accessorKey: "updatedAt",
      header: "Updated At",
      Cell: ({ renderdCellValue }) =>
        new Date(renderdCellValue).toLocaleString(),
    });
  }
  if (isDeletedAt) {
    newColumn.push({
      accessorKey: "deletedAt",
      header: "Deleted At",
      Cell: ({ renderdCellValue }) =>
        new Date(renderdCellValue).toLocaleString(),
    });
  }
  return newColumn;
};

// Helper function for "x days ago" format
const getTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (let unit of units) {
    const quotient = Math.floor(diffInSeconds / unit.seconds);
    if (quotient > 0) {
      return `${quotient} ${unit.label}${quotient > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};

export default getTimeAgo;


export const statusBadge = (status) => {
  const statusColorConfig = {
    pending: "#3b82f6",
    processing: "#eab308",
    shipped: "#06b6b4",
    delivered: "#22c55e",
    canceled: "#ef4444",
    cancelled: "#ef4444", // also handle UK spelling
    unverified: "#f97316",
  };

  const color = statusColorConfig[status] || "#9ca3af"; // default gray

  return (
    <span
      style={{ backgroundColor: color }}
      className="capitalize px-2 py-1 rounded-full text-xs text-white font-medium"
    >
      {status}
    </span>
  );
};
