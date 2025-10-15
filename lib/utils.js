import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const sizeOptions = [
  { label: "S", value: "S" },
  { label: "M", value: "M" },
  { label: "L", value: "L" },
  { label: "XL", value: "XL" },
  { label: "XXL", value: "XXL" },
];


export const sortingFilter =[
  {
    label:"Default Sorting", value:"default_sorting"
  },
  {
    label:"Ascending Order", value:"asc"
  },
  {
    label:"Descending Order", value:"desc"
  },
  {
    label:"Price: Low to High", value:"price_low_high"
  },
  {
    label:"Price: High to Low", value:"price_high_low"
  },
]