// Admin Sidebar icons.
import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import {  IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlinePermMedia } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_SHOW, ADMIN_COSTOMERS_SHOW, ADMIN_COUPON_ADD, ADMIN_COUPON_SHOW, ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW, ADMIN_PRODUCT_ADD, ADMIN_PRODUCT_SHOW, ADMIN_PRODUCT_VARIANT_ADD, ADMIN_PRODUCT_VARIANT_SHOW, ADMIN_REVIEW_SHOW } from "@/routes/AdminPannelRoute";

export const adminAppSidebarMenu = [
  {
    title: "Dashboard",
    url: ADMIN_DASHBOARD,
    icon: <AiOutlineDashboard />,
  },
  {
    title: "Category",
    url: "",
    icon: <BiCategory />,
    submenu: [
      {
        title: "Add Category",
        url: ADMIN_CATEGORY_ADD,
      },
      {
        title: "All Category",
        url: ADMIN_CATEGORY_SHOW,
      },
    ],
  },
  {
    title: "Products",
    url: "#",
    icon: <IoShirtOutline />,
    submenu: [
      {
        title: "Add Product",
        url: ADMIN_PRODUCT_ADD,
      },
      {
        title: "Add Variant",
        url: ADMIN_PRODUCT_VARIANT_ADD,
      },
      {
        title: "All Products",
        url: ADMIN_PRODUCT_SHOW,
      },
      {
        title: "All Variants",
        url: ADMIN_PRODUCT_VARIANT_SHOW,
      },
    ],
  },
  {
    title: "Coupons",
    url: "#",
    icon: <RiCoupon2Line />,
    submenu: [
      {
        title: "Add Coupons",
        url: ADMIN_COUPON_ADD,
      },
      {
        title: "All Coupons",
        url: ADMIN_COUPON_SHOW,
      },
    ],
  },
  {
    title: "Orders",
    url: "#",
    icon: <MdOutlineShoppingBag />,
  },
  {
    title: "Customers",
    url: ADMIN_COSTOMERS_SHOW,
    icon: <LuUserRound />,
  },
  {
    title: "Rating and Review",
    url: ADMIN_REVIEW_SHOW,
    icon: <IoMdStarOutline />,
  },
  {
    title: "Media",
    url: ADMIN_MEDIA_SHOW,
    icon: <MdOutlinePermMedia />,
  },
];
