
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
