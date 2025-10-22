"use client";

import {
  USER_DASHBOARD,
  WEBSITE_ACCESSORIES,
  WEBSITE_FOOTWARES,
  WEBSITE_HOME,
  WEBSITE_LOGIN,
  WEBSITE_MEN_COLLECTION,
  WEBSITE_SHOP,
  WEBSITE_WOMEN_COLLECTION,
} from "@/routes/WebsiteRoute";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import Cart from "./Cart";
import { MdAccountCircle } from "react-icons/md";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { LuMenu, LuX } from "react-icons/lu";
import Search from "./Search";

const Header = () => {
  const auth = useSelector((store) => store.authStore.auth);
  console.log(auth)

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b">
      {/* Main Header */}
      <div className="flex justify-between items-center lg:py-4 py-3 lg:px-22 xl:px-32 px-4">
        {/* Logo */}
        <Link href={WEBSITE_HOME}>
          <Image
            className="lg:w-26 w-22"
            src="https://res.cloudinary.com/dwpp4trl9/image/upload/v1760965257/uploads/wtvtjulk8nwvbettirlz.png"
            width={383}
            height={146}
            alt="logo"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          <ul className="flex items-center gap-6">
            <li>
              <Link
                href={WEBSITE_MEN_COLLECTION}
                className="relative text-lg text-zinc-700 after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                Men Collections
              </Link>
            </li>
            <li>
              <Link
                href={WEBSITE_WOMEN_COLLECTION}
                className="relative text-lg text-zinc-700 after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                Women Collections
              </Link>
            </li>
            <li>
              <Link
                href={WEBSITE_FOOTWARES}
                className="relative text-lg text-zinc-700 after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                Footwares
              </Link>
            </li>
            <li>
              <Link
                href={WEBSITE_ACCESSORIES}
                className="relative text-lg text-zinc-700 after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                Accessories
              </Link>
            </li>
            <li>
              <Link
                href={WEBSITE_SHOP}
                className="relative text-lg text-zinc-700 after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                Shop
              </Link>
            </li>
          </ul>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <IoIosSearch onClick={()=>setShowSearch(!showSearch)} className="text-zinc-500 hover:text-primary cursor-pointer" size={20} />
          
          <Cart />

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden text-zinc-500 hover:text-primary"
            onClick={toggleSidebar}
          >
            <LuMenu size={25} />
          </button>

          {/* User */}
          {!auth ? (
            <Link href={WEBSITE_LOGIN}>
              <MdAccountCircle className="text-zinc-500 hover:text-primary cursor-pointer" size={25} />
            </Link>
          ) : (
            <Link href={USER_DASHBOARD}>
              <Avatar>
                <AvatarImage src={auth?.avatar || "/assets/images/user.png"} />
              </Avatar>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={toggleSidebar}>
            <LuX size={25} />
          </button>
        </div>
        <ul className="flex flex-col gap-4 p-4">
          {[WEBSITE_MEN_COLLECTION, WEBSITE_WOMEN_COLLECTION, WEBSITE_FOOTWARES, WEBSITE_ACCESSORIES, WEBSITE_SHOP].map((link, idx) => (
            <li key={idx}>
              <Link
                href={link}
                onClick={toggleSidebar}
                className="relative font-medium text-zinc-700 hover:text-primary after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.split("/")[1]?.replace("-", " ").toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-25 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      <Search  isShow={showSearch} />
    </header>
  );
};

export default Header;
