'use client'
import useFetch from "@/hooks/useFetch";
import { ADMIN_CATEGORY_SHOW, ADMIN_COSTOMERS_SHOW, ADMIN_PRODUCT_SHOW } from "@/routes/AdminPannelRoute";
import Link from "next/link";
import React from "react";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { MdOutlineShoppingBag } from "react-icons/md";

const CountOverView = () => {

    const {data:count} = useFetch({url:"/api/dashboard/admin/count"})

  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-2 sm:gap-4 gap-2 xl:gap-8">
      <Link href={ADMIN_CATEGORY_SHOW}>
        <div className="flex items-center justify-between p-3 rounded-lg border shadow border-l-2 border-l-green-400 bg-white dark:bg-card dark:border-zinc-600 dark:border-l-green-400">
          <div>
            <h4 className="">Total Categories</h4>
            <span className=" text-lg font-bold">{count?.data?.category || 0}</span>
          </div>
          <div>
            <span className="w-10 h-10 border flex justify-center items-center rounded-full">
              <BiCategory className=""/>
            </span>
          </div>
        </div>
      </Link>
      <Link href={ADMIN_PRODUCT_SHOW}>
        <div className="flex items-center justify-between p-3 rounded-lg border shadow border-l-2 border-l-red-400 bg-white dark:bg-card dark:border-zinc-600 dark:border-l-red-400">
          <div>
            <h4 className="">Total Products</h4>
            <span className="text-lg font-bold">{count?.data?.product || 0}</span>
          </div>
          <div>
            <span className="w-10 h-10 border flex justify-center items-center rounded-full">
              <IoShirtOutline className=""/>
            </span>
          </div>
        </div>
      </Link>
      <Link href={ADMIN_COSTOMERS_SHOW}>
        <div className="flex items-center justify-between p-3 rounded-lg border shadow border-l-2 border-l-blue-400 bg-white dark:bg-card dark:border-zinc-600 dark:border-l-blue-400">
          <div>
            <h4 className="">Total Costomers</h4>
            <span className="text-lg font-bold">{count?.data?.costomer || 0} </span>
          </div>
          <div>
            <span className="w-10 h-10 border flex justify-center items-center rounded-full">
              <LuUserRound className=""/>
            </span>
          </div>
        </div>
      </Link>
      <Link href={""}>
        <div className="flex items-center justify-between p-3 rounded-lg border shadow border-l-2 border-l-yellow-400 bg-white dark:bg-card dark:border-zinc-600 dark:border-l-yellow-400">
          <div>
            <h4 className="">Total Order</h4>
            <span className="text-lg font-bold">{count?.data?.order || 0}</span>
          </div>
          <div>
            <span className="w-10 h-10 border flex justify-center items-center rounded-full">
              <MdOutlineShoppingBag className=""/>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CountOverView;
